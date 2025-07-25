import TaskModel from "../models/task.js";
import employeeModel from "../models/employee.js";
import userModel from "../models/user.js";
import notificationModal from "../models/notifications.js";
import { sendVerificationEmail } from "../utils/transporter.js";
import EmailTemplateModal from "../models/emailTemplate.js";

export const createTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      assigned_to,
      employeeId,
      due_date,
      status,
    } = req.body;
    const task = await TaskModel.create({
      title,
      description,
      priority,
      assigned_to,
      employeeId,
      due_date,
      status,
      ownerId: id,
    });
    //
    // 🔔 Emit notification via socket.io before sending response
    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const existingEmployee = await userModel.findOne({ email: employee.email });
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const template = await EmailTemplateModal.findOne({
      templatePurpose: "task-assigned",
    });
    if (!template) {
      return res
        .status(500)
        .json({ message: "Task Assigned Email Template Not Found" });
    }

    const htmlContent = template.htmlContent;

    await sendVerificationEmail(
      existingEmployee.email,
      htmlContent,
      template.subject
    );
    //
    req.io.emit("notification", {
      type: "tasks",
      forId: existingEmployee._id,
      ownerId: id,
      requestId: task._id,
      message: `New Task received`,
    });
    //

    const newNotification = await notificationModal.create({
      type: "tasks",
      forId: existingEmployee._id,
      ownerId: id,
      message: `New Task request received`,
      moduleName: "content-request",
    });
    //
    res.status(201).json(task);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error creating task" });
  }
};

export const getAgencyTasks = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Try finding tasks with matching ownerId
    const ownerTasks = await TaskModel.find({ ownerId: id });

    if (ownerTasks && ownerTasks.length > 0) {
      return res.status(200).json(ownerTasks);
    }

    // Step 2: Try matching employeeId via user email
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(200).json({ tasks: [] }); // No owner match and not a valid user
    }

    const employee = await employeeModel.findOne({ email: user.email });
    if (!employee) {
      return res.status(200).json({ tasks: [] }); // No employee found for user
    }

    const employeeTasks = await TaskModel.find({ employeeId: employee._id });
    if (!employeeTasks || employeeTasks.length === 0) {
      return res.status(200).json({ tasks: [] });
    }

    res.status(200).json(employeeTasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params; // This is the task ID you want to update
    const {
      title,
      description,
      priority,
      assigned_to,
      employeeId,
      due_date,
      status,
    } = req.body;

    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        priority,
        assigned_to,
        employeeId,
        due_date,
        status,
      },
      { new: true } // Return the updated document
    );

    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const existingEmployee = await userModel.findOne({ email: employee.email });
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    //
    const template = await EmailTemplateModal.findOne({
      templatePurpose: "task-updated",
    });
    if (!template) {
      res.status(500).json({ message: "Task Update Email Template Not Found" });
    }

    const htmlContent = template.htmlContent;
    const agencyOwner = await userModel.findById({ _id: employee.ownerId });

    await sendVerificationEmail(
      existingEmployee.email,
      htmlContent,
      template.subject
    );
    await sendVerificationEmail(
      agencyOwner.email,
      htmlContent,
      template.subject
    );
    //
    req.io.emit("notification", {
      type: "tasks",
      forId: existingEmployee._id,
      ownerId: employee.ownerId,
      message: `An existing task updated`,
    });
    //

    const newNotification = await notificationModal.create({
      type: "tasks",
      forId: existingEmployee._id,
      ownerId: id,
      message: `An existing task updated`,
      moduleName: "content-request",
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // This is the task ID you want to delete

    const deletedTask = await TaskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    //
    const employee = await employeeModel.findById(deletedTask.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const existingEmployee = await userModel.findOne({ email: employee.email });
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const template = await EmailTemplateModal.findOne({
      templatePurpose: "task-deleted",
    });
    if (!template) {
      res
        .status(500)
        .json({ message: "Task Deleted Email Template Not Found" });
    }

    const htmlContent = template.htmlContent;

    await sendVerificationEmail(
      existingEmployee.email,
      htmlContent,
      template.subject
    );
    //
    req.io.emit("notification", {
      type: "tasks",
      forId: existingEmployee._id,
      ownerId: deletedTask.ownerId,
      message: `A task removed`,
    });
    //

    const newNotification = await notificationModal.create({
      type: "tasks",
      forId: existingEmployee._id,
      ownerId: id,
      message: `A task removed`,
      moduleName: "content-request",
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting task" });
  }
};
