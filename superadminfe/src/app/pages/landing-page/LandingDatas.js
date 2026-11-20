import MarketingImg from "../../assets/images/landing-Images/marketing.png";
import SalesImg from "../../assets/images/landing-Images/sales.png";
import ContactImg from "../../assets/images/landing-Images/contact.png";
import LeadImg from "../../assets/images/landing-Images/lead.png";
import DealImg from "../../assets/images/landing-Images/deal-management.png";
import CapaignImg from "../../assets/images/landing-Images/Campaign.png";
import TerritoryImg from "../../assets/images/landing-Images/territory.png";
import TaskManagementImg from "../../assets/images/landing-Images/taskmanagement.png";
import WorkflowImg from "../../assets/images/landing-Images/workflow.png";
import AccountImg from "../../assets/images/landing-Images/accounts.jpg";

export const landingDatas = [
  {
    id: "marketing",
    title: "Marketing",
    image: MarketingImg,
    content: {
      subContent:
        "The aim of marketing is to know and understand the customer so well the product or service fits him and sells itself.",
      author: "Peter Drucker",
      para: "One place to manage your contacts, leads, deals and campaigns.",
      points: [
        "Seamless Integration with Sales: CRM FARM’s marketing module is seamlessly integrated with the sales pipeline",
        "Facilitates a seamless journey from lead generation to conversion.",
        "Ensuring that sales teams have access to all relevant marketing data, improving collaboration and overall sales effectiveness.",
      ],
    },
  },
  {
    id: "contact-management",
    title: "Contact Management",
    image: ContactImg,
    content: {
      subContent:
        "The richest people in the world look for and build networks; everyone else looks for work.",
      author: "Robert Kiyosaki",
      para: "One place to manage your contacts and calls.",
      points: [
        "Centralized Contact Repository provides a single, unified platform where all your customer and prospect information is stored.",
        "Ensures that your team has easy access to up-to-date contact details, interaction history, and communication preferences, enhancing collaboration and customer service.",
        "Gain a comprehensive view of every interaction your business has with a contact, from emails and phone calls to meetings and social media engagements.",
      ],
    },
  },
  {
    id: "lead-management",
    title: "Lead Management",
    image: LeadImg,
    content: {
      subContent:
        "Nurturing your leads with the right content at the right time is the cornerstone of successful lead management",
      author: "Brian Halligan",
      para: "Lead Management made easy",
      points: [
        "Complete lead journey as per your convenience, lead management made easy & simplified.",
        "With CRM FARM, you can monitor the progress of every lead in real-time, from initial contact to closing the deal.",
        "The platform offers detailed analytics and reporting, enabling data-driven decisions to optimize your lead management strategies.",
      ],
    },
  },
  {
    id: "deal-management",
    title: "Deal Management",
    image: DealImg,
    content: {
      subContent:
        "The best way to close a deal is to provide value. If you can create value, people will pay for it.",
      author: "Gary Vaynerchuk",
      para: "Manage your deals, dashboard and pipeline deals.",
      points: [
        "Create and customize deal pipelines to match your sales process",
        "Flexibility to track deals at every stage, ensuring that no opportunity is overlooked and that your sales process aligns perfectly with your business needs.",
        "Helps in better decision-making to identify trends, predict outcomes, and adjust strategies to close more deals successfully.",
      ],
    },
  },
  {
    id: "campaigns",
    title: "Campaign",
    image: CapaignImg,
    content: {
      subContent:
        "A successful campaign requires both a compelling message and the discipline to stay on that message.",
      author: "Karl Rove",
      para: "Complete control over campaigning",
      points: [
        "Targeted Campaign Management: CRM FARM allows you to segment your customer base and create highly targeted marketing campaigns.",
        "Ensures that the right message reaches the right audience, increasing the effectiveness of your marketing efforts and boosting conversion rates.",
      ],
    },
  },
  {
    id: "customers",
    title: "Customers",
    image: AccountImg,
    content: {
      subContent: "Accounting is the language of business.",
      author: "Warren Buffett",
      para: "",
      points: [
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Integrated Feedback System:{" "}
          </span>{" "}
          The Accounts module features a built-in feedback template, allowing
          you to easily collect, track, and analyse customer feedback, helping
          you continuously improve your services.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Detailed Feedback Reports:{" "}
          </span>{" "}
          Gain valuable insights with comprehensive feedback reports that
          highlight customer satisfaction trends, enabling data-driven decisions
          to enhance your sales strategy.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Seamless Customer Interaction:{" "}
          </span>{" "}
          The module’s conversation tools facilitate smooth communication with
          customers, ensuring that their concerns and inquiries are promptly
          addressed, fostering stronger relationships.
        </>,
      ],
    },
  },
  {
    id: "sales",
    title: "Sales",
    image: SalesImg,
    content: {
      subContent:
        "Great salespeople are relationship builders who provide value and help their customers win.",
      author: "Jeffrey Gitomer",
      para: "sales content",
      points: [
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Comprehensive Sales Management:
          </span>{" "}
          CRM FARM’s Sales module provides an all-in-one platform to manage
          every aspect of the sales process—from customer enquiries and
          quotations to order management, invoicing, and payments—ensuring
          nothing falls through the cracks.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Streamlined Workflow with Real-Time Insights:
          </span>{" "}
          The intuitive dashboard offers real-time insights into sales
          performance, while integrated tools like shipment calendars and
          delivery confirmations help keep your sales process smooth and
          efficient.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Flexible Product and Pricing Configuration:{" "}
          </span>{" "}
          Easily configure products, manage pricing, and streamline your store
          operations, allowing you to respond quickly to customer demands and
          market changes, all within the CRM FARM platform.
        </>,
      ],
    },
  },
  {
    id: "territory-management",
    title: "Territory Management",
    image: TerritoryImg,
    content: {
      subContent:
        "Effective territory management is crucial for aligning your sales efforts with market opportunities and driving business growth.",
      author: "Jill Konrath",
      para: "Optimize Sales Performance with CRM FARM’s Territory Management",
      points: [
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Strategic Territory Hierarchy:
          </span>{" "}
          CRM FARM’s robust territory hierarchy feature allows for the effective
          organization and segmentation of sales territories, enabling targeted
          and strategic management that drives performance and maximizes sales
          potential.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Dynamic Territory and Target Management:{" "}
          </span>{" "}
          Easily manage and adjust territories and sales targets to align with
          evolving business goals and market conditions, ensuring that your
          sales strategy remains agile and responsive.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Enhanced Sales Performance Tracking:
          </span>{" "}
          With integrated sales and salesperson targets, CRM FARM provides
          comprehensive tracking and insights into sales performance, helping to
          drive accountability and achieve your sales objectives.
        </>,
      ],
    },
  },
  {
    id: "task-managements",
    title: "Task Management",
    image: TaskManagementImg,
    content: {
      subContent:
        "Effective task management is the key to ensuring that every project is completed on time and to the highest standard.",
      author: "David Allen",
      para: "Master Task Efficiency with CRM FARM’s Advanced Task Management",
      points: [
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Organized Task Tracking:
          </span>{" "}
          With the task list feature, easily organize, prioritize, and track
          tasks, ensuring every detail is managed effectively and deadlines are
          met.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Visualize Progress with Gantt Charts:{" "}
          </span>{" "}
          The Gantt chart feature provides a clear visual representation of task
          timelines and dependencies, helping you manage projects more
          efficiently and stay on schedule.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Integrated Task Calendar:
          </span>{" "}
          The task calendar offers a centralized view of all tasks and
          deadlines, facilitating better planning and coordination while keeping
          your team aligned and informed.
        </>,
      ],
    },
  },
  {
    id: "work-flows",
    title: "Work Flow",
    image: WorkflowImg,
    content: {
      subContent:
        "A well-designed workflow in CRM streamlines processes, reduces manual tasks, and enhances productivity by automating routine tasks.",
      author: "David Raab",
      para: "Transform Your Operations with CRM FARM’s Customizable Workflow Management",
      points: [
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Tailored Workflow Automation:{" "}
          </span>{" "}
          CRM FARM’s Work rules feature allows users to create and customize
          workflows with specific triggers, automating routine tasks and
          ensuring consistent execution of business processes.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Enhanced Efficiency with Triggers:{" "}
          </span>{" "}
          Set up workflow triggers to automatically initiate actions based on
          predefined conditions, streamlining operations and reducing manual
          intervention for greater efficiency.
        </>,
        <>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>
            Flexible and Adaptable Workflows:
          </span>{" "}
          Customize workflows to fit your unique business needs, providing the
          flexibility to adapt to changing requirements and optimize processes
          for improved productivity and performance.
        </>,
      ],
    },
  },

  {
    id: "",
    title: "",
    image: "",
    content: {
      subContent: "",
      author: "",
      para: "",
      points: [],
    },
  },
];
