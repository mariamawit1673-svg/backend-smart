require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const phone = '+251911000000';
  const password = 'admin@1234';
  const hash = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    { phone },
    {
      name: 'Admin',
      phone,
      password: hash,
      role: 'admin',
      email: 'admin@smartagri.com'
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('✅ Admin account ready:');
  console.log('   Name    :', user.name);
  console.log('   Phone   :', user.phone);
  console.log('   Email   :', user.email);
  console.log('   Password: admin@1234');
  console.log('   Role    :', user.role);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
