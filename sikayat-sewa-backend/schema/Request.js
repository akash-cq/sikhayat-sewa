import z from 'zod';
const RequestsData = z.object({
    fileName: z.string(),
    title: z.string(),
    description: z.string(),
    userId: z.string(),
})
export default RequestsData;