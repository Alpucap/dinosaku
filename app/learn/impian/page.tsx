import { getTrackerData } from '../tracker/actions';
import ImpianClient from './ImpianClient';

export default async function ImpianPage() {
    const data = await getTrackerData();

    return (
        <ImpianClient
            initialTransactions={data.transactions as any}
            initialGoals={data.goals as any}
        />
    );
}
