import { getTrackerData } from './actions';
import TrackerClient from './TrackerClient';

export default async function TrackerPage() {
    const data = await getTrackerData();

    return (
        <TrackerClient 
            initialTransactions={data.transactions as any}
            initialGoals={data.goals as any} 
        />
    );
}
