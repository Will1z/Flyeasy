const db = require('../database/db');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Database is automatically initialized when the db module is imported
    // This script can be used for additional setup or data seeding
    
    // Create admin user if it doesn't exist
    const adminExists = await db.get('SELECT id FROM users WHERE email = ?', ['admin@flyeasy.com']);
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const { v4: uuidv4 } = require('uuid');
      
      const adminId = uuidv4();
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      await db.run(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, preferred_currency)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [adminId, 'admin@flyeasy.com', passwordHash, 'Admin', 'User', 'NGN']
      );
      
      console.log('✅ Admin user created');
    }
    
    // Add sample data if needed
    const bookingCount = await db.get('SELECT COUNT(*) as count FROM bookings');
    
    if (bookingCount.count === 0) {
      console.log('📊 Adding sample data...');
      
      // Add sample bookings for demo purposes
      const sampleBookings = [
        {
          id: uuidv4(),
          user_id: 'sample-user-1',
          flight_data: JSON.stringify({
            airline: 'Air Peace',
            from: 'LOS',
            to: 'ABV',
            departure: '08:30',
            arrival: '10:45',
            duration: '2h 15m',
            price: 85000
          }),
          passenger_data: JSON.stringify([{
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          }]),
          total_amount: 85000,
          currency: 'NGN',
          booking_status: 'confirmed',
          confirmation_code: 'FG123456'
        }
      ];
      
      for (const booking of sampleBookings) {
        await db.run(
          `INSERT INTO bookings (id, user_id, flight_data, passenger_data, total_amount, currency, booking_status, confirmation_code)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [booking.id, booking.user_id, booking.flight_data, booking.passenger_data, booking.total_amount, booking.currency, booking.booking_status, booking.confirmation_code]
        );
      }
      
      console.log('✅ Sample data added');
    }
    
    console.log('🎉 Database initialization complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();