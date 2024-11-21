import { create } from 'zustand';
import { VotingData, Place, ActivityLog, VotingDate } from '../types';

interface VotingState {
  places: Place[];
  votingData: VotingData[];
  activityLogs: ActivityLog[];
  votingDates: VotingDate[];
  currentDate: string | null;
  addVotingData: (data: Omit<VotingData, 'timestamp'>) => void;
  getPlaceData: (placeId: number, date?: string) => VotingData[];
  getZonalData: (date?: string) => {
    totalVotes: number;
    totalMale: number;
    totalFemale: number;
    votingPercentage: number;
  };
  getCumulativeVotes: (upToDate?: string) => {
    byPlace: Record<number, number>;
    total: number;
  };
  setDateActive: (date: string, isActive: boolean) => void;
  setDateComplete: (date: string, isComplete: boolean) => void;
  setCurrentDate: (date: string | null) => void;
  reset: () => void;
}

const PLACES: Place[] = [
  { id: 1, name: 'Headquarter', totalVoters: 3296 },
  { id: 2, name: 'Malda Division', totalVoters: 9962 },
  { id: 3, name: 'Howrah Division', totalVoters: 25224 },
  { id: 4, name: 'Sealdah Division', totalVoters: 21038 },
  { id: 5, name: 'Liluah Workshop', totalVoters: 6709 },
  { id: 6, name: 'Kanchrapara Workshop', totalVoters: 7346 },
  { id: 7, name: 'Jamalpur Workshop', totalVoters: 6909 },
  { id: 8, name: 'Asansol Division', totalVoters: 17257 },
];

const INITIAL_VOTING_DATES: VotingDate[] = [
  { date: '2024-12-04', isActive: true, isComplete: false },
  { date: '2024-12-05', isActive: false, isComplete: false },
  { date: '2024-12-06', isActive: false, isComplete: false },
  { date: '2024-12-10', isActive: false, isComplete: false },
];

export const useVotingStore = create<VotingState>((set, get) => ({
  places: PLACES,
  votingData: [],
  activityLogs: [],
  votingDates: INITIAL_VOTING_DATES,
  currentDate: '2024-12-04',

  addVotingData: (data) => {
    const timestamp = Date.now();
    const newLog: ActivityLog = {
      id: timestamp.toString(),
      timestamp,
      placeName: PLACES.find(p => p.id === data.placeId)?.name || '',
      role: data.submittedBy.role,
      votesCount: data.votesCount,
      maleVoters: data.maleVoters,
      femaleVoters: data.femaleVoters,
      date: data.date,
    };

    set((state) => ({
      votingData: [...state.votingData, { ...data, timestamp }],
      activityLogs: [newLog, ...state.activityLogs],
    }));
  },

  getPlaceData: (placeId, date) => {
    const data = get().votingData;
    return data.filter(d => 
      d.placeId === placeId && 
      (!date || d.date === date)
    );
  },

  getCumulativeVotes: (upToDate) => {
    const data = get().votingData;
    const dates = get().votingDates;
    
    const sortedDates = [...dates].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const targetDateIndex = upToDate 
      ? sortedDates.findIndex(d => d.date === upToDate)
      : sortedDates.length - 1;

    const relevantDates = sortedDates
      .slice(0, targetDateIndex + 1)
      .map(d => d.date);

    const relevantData = data.filter(d => relevantDates.includes(d.date));

    const byPlace = relevantData.reduce((acc, curr) => {
      acc[curr.placeId] = (acc[curr.placeId] || 0) + curr.votesCount;
      return acc;
    }, {} as Record<number, number>);

    const total = Object.values(byPlace).reduce((sum, votes) => sum + votes, 0);

    return { byPlace, total };
  },

  getZonalData: (date) => {
    const data = get().votingData;
    const places = get().places;
    const totalVoterCount = places.reduce((sum, place) => sum + place.totalVoters, 0);
    
    const { total: totalVotesCast } = get().getCumulativeVotes(date);
    
    const currentDateData = date ? data.filter(d => d.date === date) : data;
    const maleVoters = currentDateData.reduce((sum, d) => sum + d.maleVoters, 0);
    const femaleVoters = currentDateData.reduce((sum, d) => sum + d.femaleVoters, 0);

    return {
      totalVotes: totalVotesCast,
      totalMale: maleVoters,
      totalFemale: femaleVoters,
      votingPercentage: (totalVotesCast / totalVoterCount) * 100,
    };
  },

  setDateActive: (date, isActive) => {
    set((state) => ({
      votingDates: state.votingDates.map(d => 
        d.date === date ? { ...d, isActive } : { ...d, isActive: false }
      ),
      currentDate: isActive ? date : state.currentDate,
    }));
  },

  setDateComplete: (date, isComplete) => {
    set((state) => ({
      votingDates: state.votingDates.map(d => 
        d.date === date ? { ...d, isComplete, isActive: false } : d
      ),
    }));
  },

  setCurrentDate: (date) => {
    set({ currentDate: date });
  },

  reset: () => {
    set({
      votingData: [],
      activityLogs: [],
      votingDates: INITIAL_VOTING_DATES,
      currentDate: '2024-12-04'
    });
  },
}));