import { Router } from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.middleware';
import authRoutes from './auth.route';
import memberRoutes from './member.route';
import projectRoutes from './project.route';
import taskRoutes from './task.route';
import userRoutes from './user.route';
import workspaceRoutes from './workspace.route';

const router = Router();

router.use('/auth', authRoutes);

router.use(isAuthenticated);
router.use('/user', userRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/member', memberRoutes);
router.use('/project', projectRoutes);
router.use('/task', taskRoutes);

export default router;
