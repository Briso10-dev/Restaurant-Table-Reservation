// File: src/core/template/index.ts
import ejs from "ejs";
import path from "path";

const EmailTemplate = {
  QRcodeSender: async (employeeName: string,message: string,QRcode: string) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "reminder.ejs"), {
        employeeName,
        message,
        QRcode
      });
      return html;
    } catch (error) {
      console.error("Error rendering Reminder template:", error);
      return "";
    }
  },
};

export default EmailTemplate;