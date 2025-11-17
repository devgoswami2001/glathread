# **App Name**: SwiftFlow

## Core Features:

- Request Creation: Supervisors can create transport requests with vehicle details, document uploads, and request type selection.
- Automated Thread Creation: Upon request submission, a new chat thread is automatically created with a system message containing request details and status.
- CFO Approval Workflow: CFOs can approve or reject requests directly within the chat thread using inline buttons. Rejection closes the thread, while approval prompts for start and end dates.
- Out-Pass Generation & QR Code: For specific request types, supervisors can generate an out-pass with a QR code, which can be scanned by the gate team for vehicle exit and entry tracking.
- Deadline Management: Automated deadline tracking with notifications for missed deadlines, prompting supervisors to provide a reason and request a new date. CFO approval required for timeline extensions.
- Payment Tracking: Supervisors can mark work as completed and upload GLAMS approval PDFs. The system initiates a payment timer with automated reminders if payment confirmation is not uploaded within five working days.
- Chat Interface: WhatsApp-style chat interface with real-time messaging, file sharing (images, videos, PDFs, DOCX, voice notes), system messages, inline buttons/forms, typing indicators, and seen status.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to convey trust and reliability.
- Background color: Light Gray (#ECEFF1), offering a clean and modern feel.
- Accent color: Teal (#009688) to highlight interactive elements and important notifications.
- Body font: 'Inter', a sans-serif typeface, to ensure clarity and readability in all text fields.
- Headline font: 'Space Grotesk', a sans-serif typeface, giving the app a modern, computerized style. It is matched with Inter for the body.
- Use clean, vector-based icons to represent different actions, statuses, and file types within the application.
- Implement a responsive layout using Flexbox or Grid to adapt seamlessly to both mobile and desktop screens, ensuring optimal viewing and interaction experiences.
- Design the chat interface to mirror the WhatsApp user experience, with a focus on intuitive navigation, clear message presentation, and easy access to attachments and other features.