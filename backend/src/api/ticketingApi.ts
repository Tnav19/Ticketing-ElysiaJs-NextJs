import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Ticketing } from "../models/ticketing";
import { Priority } from "../models/priority";
import { Category } from "../models/categories";
import { Status } from "../models/statuses";
import { Karyawan } from "../models/karyawan";
import { Eskalasi } from "../models/eskalasi";

const ticketingApi = new Elysia({ prefix: "/ticketings" })
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  // POST - Add new ticket
  .post("/", async ({ body, set }: { body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {}; // Declare errors object

      if (!body.id_karyawans) errors.id_karyawans = "Employee ID is required";
      if (!body.id_categories) errors.id_categories = "Category must be selected";
      if (!body.id_categories) errors.id_categories = "Invalid category";
      if (!body.id_priorities) errors.id_priorities = "Priority must be selected";
      if (!body.id_priorities) errors.id_priorities = "Invalid priority";
      if (!body.id_statuses) errors.id_statuses = "Status must be selected";
      if (!body.id_statuses) errors.id_statuses = "Invalid status";
      if (!body.id_eskalasis) errors.id_eskalasis = "Escalation must be selected";
      if (!body.id_eskalasis) errors.id_eskalasis = "Invalid escalation";
      if (!body.keluhan?.trim()) errors.keluhan = "Complaint is required";
      if (!body.eskalasi?.trim()) errors.eskalasi = "Escalation is required";
      if (!body.response?.trim()) errors.response = "Response is required";
      if (!body.analisa?.trim()) errors.analisa = "Analysis is required";
      if (body.is_active === undefined) errors.is_active = "Active status is required";

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Failed to add ticket, check input!", errors };
      }

      const newTicket = await Ticketing.create(body);
      set.status = 200;
      return { success: true, message: "Ticket added successfully", data: newTicket };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Server error occurred" };
    }
  })

  // GET - Ambil semua tiket
  .get("/", async ({ set }: { set: any }) => {
    try {
      const ticketingList = await Ticketing.findAll({
        where: {is_active: 1},
        include: [         
          {
            model: Karyawan,
            attributes: ["id", "name"]
          },
          {
            model: Category,
            attributes: ["id", "name"]
          },
          {
            model: Status,
            attributes: ["id", "name"]
          },
          {
            model: Eskalasi,
            attributes: ["id", "name"]
          }
        ],
      });
      if (!ticketingList.length) {
        set.status = 400;
        return { success: false, message: "Data not found" };
      }

      set.status = 200;
      return { success: true, message: "Ticket data found", data: ticketingList };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Failed to fetch ticket data" };
    }
  })

  // GET - Ambil tiket berdasarkan ID
  .get("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const ticketing = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticketing) {
        set.status = 400;
        return { success: false, message: "Ticket not found" };
      }

      set.status = 200;
      return { success: true, message: "Ticket data found", data: ticketing };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Failed to fetch ticket data" };
    }
  })

  // PATCH - Update tiket
  .patch("/:id", async ({ params, body, set }: { params: any; body: any; set: any }) => {
    try {
      const errors: Record<string, string> = {}; // Declare errors object
      const ticketing = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticketing) {
        set.status = 400;
        return { success: false, message: "Ticket not found" };
      }

      // Allow all fields to be optional
      if (body.id_karyawans && !body.id_karyawans) errors.id_karyawans = "Employee ID is required";
      if (body.id_categories && !body.id_categories) errors.id_categories = "Category must be selected";
      if (body.id_priorities && !body.id_priorities) errors.id_priorities = "Priority must be selected";
      if (body.id_statuses && !body.id_statuses) errors.id_statuses = "Status must be selected";
      if (body.id_eskalasis && !body.id_eskalasis) errors.id_eskalasis = "Escalation must be selected";
      if (body.keluhan && !body.keluhan.trim()) errors.keluhan = "Complaint is required";
      if (body.eskalasi && !body.eskalasi.trim()) errors.eskalasi = "Escalation is required";
      if (body.response && !body.response.trim()) errors.response = "Response is required";
      if (body.analisa && !body.analisa.trim()) errors.analisa = "Analysis is required";
      if (body.is_active === undefined) errors.is_active = "Active status is required";

      if (Object.keys(errors).length) {
        set.status = 400;
        return { success: false, message: "Failed to update ticket, check input!", errors };
      }

      await ticketing.update(body);
      set.status = 200;
      return { success: true, message: "Ticket updated successfully", data: ticketing };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Failed to update ticket" };
    }
  })

  // DELETE - Soft delete tiket
  .delete("/:id", async ({ params, set }: { params: any; set: any }) => {
    try {
      const ticketing = await Ticketing.findOne({ where: { id: params.id } });
      if (!ticketing) {
        set.status = 400;
        return { success: false, message: "Ticket not found" };
      }

      await ticketing.update({ is_active: 0, deleted_at: new Date() });
      set.status = 200;
      return { success: true, message: "Ticket deleted successfully (soft delete)" };
    } catch (error) {
      set.status = 400;
      return { success: false, message: "Gagal menghapus tiket" };
    }
  });

export default ticketingApi;
