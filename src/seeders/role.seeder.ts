import chalk from "chalk";
import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {
  console.log(chalk.blue("Seeding roles started..."));

  try {
    await connectDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    console.log(chalk.yellow("Clearing existing roles..."));
    await RoleModel.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      // Check if the role already exists
      const existingRole = await RoleModel.findOne({ name: role }).session(
        session
      );
      if (!existingRole) {
        const newRole = new RoleModel({
          name: role,
          permissions: permissions,
        });
        await newRole.save({ session });
        console.log(chalk.green(`Role ${role} added with permissions.`));
      } else {
        console.log(chalk.cyan(`Role ${role} already exists.`));
      }
    }

    await session.commitTransaction();
    session.endSession();
    console.log(chalk.green("Seeding completed successfully."));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("Error during seeding:"), error);
  }
};

seedRoles().catch((error) =>
  console.error(chalk.red("Error running seed script:"), error)
);
