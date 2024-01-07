const nodemailer = require("nodemailer");

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		});
	}
	async sendSubscriptionMail(to) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: `Subscription on ${process.env.CLIENT_URL}`,
			text: "",
			html: `
                <div>
                    <h1>Bookstore subscription</h1>
                    <p>Congratulations! You have successfully subscribed to the newsletter about new book releases!</p>
                </div>
                `,
		});
	}
}

exports.module = new MailService();
