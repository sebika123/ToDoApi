const nodemailer = require('nodemailer');

async function testGmail() {
  console.log('🔧 Testing Gmail SMTP connection...\n');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sebika.ebpearls@gmail.com',
      pass: 'zdbqglwjmeschrly', // NO SPACES
    },
    debug: true,
  });

  try {
    console.log('1. Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    console.log('2. Sending test email...');
    const info = await transporter.sendMail({
      from: '"Todo List" <sebika.ebpearls@gmail.com>',
      to: 'sebika.ebpearls@gmail.com', // Send to yourself
      subject: 'Test Email from Todo List',
      text: 'This is a test email from Todo List application.',
      html: '<h1>Test Email</h1><p>This is a test email from Todo List application.</p>',
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📫 Message ID: ${info.messageId}`);
    console.log(`📧 To: ${info.envelope.to}`);
    console.log(`📤 From: ${info.envelope.from}`);

    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

testGmail();
