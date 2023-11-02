import envConfig from "@/envConfig";
import nodemailer from "nodemailer";

class SendMail {
  private transporter: any;
  private email: string;
  private password: string;
  constructor() {
    this.email = envConfig.get("NODE_MAILER_EMAIL");
    this.password = envConfig.get("NODE_MAILER_PASSWORD");
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: this.email,
        pass: this.password,
      },
    });
  }

  sendMail = async (receiver: string) => {
    const mailOptions = {
      from: `"Trum Ban The" <${this.email}>`,
      to: receiver.split(","),
      subject: `[Trùm Bán Thẻ] Thông tin đơn hàng`,
      html: this.formatContentForSend(),
    };

    await this.transporter.sendMail(
      mailOptions,
      function (error: any, info: any) {
        if (error) {
          console.error(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      }
    );
  };

  formatContentForSend = () => {
    const text = `
        <!doctype html>
        <html ⚡4email>
            <head>
                <style>
                table {
                    font-family: arial, sans-serif;
                    border-collapse: collapse;
                    width: auto;
                }
                
                td, th {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }
                
                tr:nth-child(even) {
                    background-color: #dddddd;
                }
                </style>
            </head>
            <body>

            <p> Số seri </p> \n
                <h2> 9999999999 </h2>\n



            <p>Mã thẻ</p> \n
                <h2> hihihihihi </h2>\n
    
            
          
            
            </body>
        </html>
        `;
    return text.toString();
  };
}

export default SendMail;
