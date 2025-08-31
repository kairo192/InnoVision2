import { applicants, users, type User, type InsertUser, type Applicant, type InsertApplicant } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, gte, lte, like, count, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Applicant methods
  createApplicant(applicant: InsertApplicant & { age: number; applicationId: string }): Promise<Applicant>;
  getApplicant(id: string): Promise<Applicant | undefined>;
  getApplicantByApplicationId(applicationId: string): Promise<Applicant | undefined>;
  getApplicants(filters?: {
    search?: string;
    wilaya?: string;
    course?: string;
    ageGroup?: 'kids' | 'adults';
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'fullName' | 'age';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ applicants: Applicant[]; total: number }>;
  updateApplicant(id: string, updates: Partial<Applicant>): Promise<Applicant>;

  // Analytics methods
  getApplicantStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    courseDistribution: { course: string; count: number }[];
    wilayaDistribution: { wilaya: string; count: number }[];
    ageGroupDistribution: { ageGroup: string; count: number }[];
    dailySignups: { date: string; count: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createApplicant(applicantData: InsertApplicant & { age: number; applicationId: string }): Promise<Applicant> {
    const [applicant] = await db
      .insert(applicants)
      .values(applicantData)
      .returning();
    return applicant;
  }

  async getApplicant(id: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.id, id));
    return applicant || undefined;
  }

  async getApplicantByApplicationId(applicationId: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.applicationId, applicationId));
    return applicant || undefined;
  }

  async getApplicants(filters: Parameters<IStorage['getApplicants']>[0] = {}): Promise<{ applicants: Applicant[]; total: number }> {
    const {
      search,
      wilaya,
      course,
      ageGroup,
      dateFrom,
      dateTo,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const conditions = [];

    if (search) {
      const searchCondition = like(applicants.fullName, `%${search}%`);
      conditions.push(searchCondition);
    }

    if (wilaya) {
      conditions.push(eq(applicants.wilaya, wilaya));
    }

    if (course) {
      conditions.push(eq(applicants.course, course));
    }

    if (ageGroup) {
      if (ageGroup === 'kids') {
        conditions.push(and(gte(applicants.age, 8), lte(applicants.age, 17)));
      } else if (ageGroup === 'adults') {
        conditions.push(gte(applicants.age, 18));
      }
    }

    if (dateFrom) {
      conditions.push(gte(applicants.createdAt, new Date(dateFrom)));
    }

    if (dateTo) {
      conditions.push(lte(applicants.createdAt, new Date(dateTo)));
    }

    // Build base queries
    let query = db.select().from(applicants);
    let countQuery = db.select({ count: count() }).from(applicants);

    // Apply filters
    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition) as typeof query;
      countQuery = countQuery.where(whereCondition) as typeof countQuery;
    }

    // Add sorting
    const sortColumn = sortBy === 'createdAt' ? applicants.createdAt :
                      sortBy === 'fullName' ? applicants.fullName :
                      applicants.age;
    
    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)) as typeof query;

    // Add pagination
    query = query.limit(limit).offset(offset) as typeof query;

    const [applicantsResult, [{ count: total }]] = await Promise.all([
      query,
      countQuery
    ]);

    return {
      applicants: applicantsResult,
      total
    };
  }

  async updateApplicant(id: string, updates: Partial<Applicant>): Promise<Applicant> {
    const [applicant] = await db
      .update(applicants)
      .set(updates)
      .where(eq(applicants.id, id))
      .returning();
    return applicant;
  }

  async getApplicantStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total count
    const [{ count: total }] = await db.select({ count: count() }).from(applicants);

    // Today's count
    const [{ count: todayCount }] = await db
      .select({ count: count() })
      .from(applicants)
      .where(gte(applicants.createdAt, today));

    // This week's count
    const [{ count: weekCount }] = await db
      .select({ count: count() })
      .from(applicants)
      .where(gte(applicants.createdAt, weekAgo));

    // Course distribution
    const courseDistribution = await db
      .select({
        course: applicants.course,
        count: count()
      })
      .from(applicants)
      .groupBy(applicants.course);

    // Wilaya distribution
    const wilayaDistribution = await db
      .select({
        wilaya: applicants.wilaya,
        count: count()
      })
      .from(applicants)
      .groupBy(applicants.wilaya)
      .orderBy(desc(count()));

    // Age group distribution
    const allApplicants = await db.select({ age: applicants.age }).from(applicants);
    const ageGroupDistribution = allApplicants.reduce((acc, { age }) => {
      const group = age >= 8 && age <= 17 ? 'kids' : 'adults';
      const existing = acc.find(item => item.ageGroup === group);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ ageGroup: group, count: 1 });
      }
      return acc;
    }, [] as { ageGroup: string; count: number }[]);

    // Daily signups for the last 30 days
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailySignupsRaw = await db
      .select({
        date: sql<string>`DATE(${applicants.createdAt})`,
        count: count()
      })
      .from(applicants)
      .where(gte(applicants.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${applicants.createdAt})`)
      .orderBy(sql`DATE(${applicants.createdAt})`);

    const dailySignups = dailySignupsRaw.map(item => ({
      date: item.date,
      count: Number(item.count)
    }));

    return {
      total: Number(total),
      today: Number(todayCount),
      thisWeek: Number(weekCount),
      courseDistribution: courseDistribution.map(item => ({
        course: item.course,
        count: Number(item.count)
      })),
      wilayaDistribution: wilayaDistribution.map(item => ({
        wilaya: item.wilaya,
        count: Number(item.count)
      })),
      ageGroupDistribution,
      dailySignups
    };
  }
}

export const storage = new DatabaseStorage();
