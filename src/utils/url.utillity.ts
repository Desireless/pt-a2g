export const getUrlParams = (url: string): { pageNumber: number, pageSize: number, fleet: string } => {
    const params = new URLSearchParams(url.split('?')[1]);
    const pageNumber = Number(params.get('pageNumber'));
    const pageSize = Number(params.get('pageSize'));
    const fleet = params.get('fleet') as string;

    return { pageNumber, pageSize, fleet };
}