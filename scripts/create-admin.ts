import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from '../server/db';
import { users } from '@shared/schema';

async function createAdmin() {
  try {
    const email = 'admin@innovision.dz';
    const password = 'admin123'; 
    
    console.log('Creating admin user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert admin user
    const [admin] = await db.insert(users).values({
      email,
      password: hashedPassword,
      role: 'admin'
    }).returning();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 User ID:', admin.id);
    console.log('');
    console.log('You can now login at: http://localhost:5000/admin/login');
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error: any) {
    if (error.code === '23505') { 
      console.log('❌ Admin user with this email already exists!');
      console.log('📧 Email: admin@innovision.dz');
      console.log('🔑 Password: admin123');
      console.log('');
      console.log('You can login at: http://localhost:5000/admin/login');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  } finally {
    process.exit(0);
  }
}

createAdmin();