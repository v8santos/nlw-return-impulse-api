import express, { Request, Response } from 'express';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';

export const routes = express.Router();

routes.post('/feedbacks', async (request: Request, response: Response) => {
    const { comment, type, screenshot } = request.body;

    const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
    const nodemailerMailAdapter = new NodemailerMailAdapter();

    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
        prismaFeedbacksRepository,
        nodemailerMailAdapter
    );

    try {
       await submitFeedbackUseCase.execute({
            type,
            comment,
            screenshot
        });
    } catch(error) {
        console.log(error);

        return response.status(500).send({
            message: "server error"
        });
    }

    return response.status(201).send();
});