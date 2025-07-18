import { create } from "zustand";
interface SessionStorage {
  token?: string;
  userId: string;
  name: string;
  email: string;
  roll: number;
  isAuthenticated: boolean;
}

interface UsersData {
  name: string;
  email: string;
  userId: string;
  roll: number;
  isVerified: boolean;
}
interface RequestData {
  RequestId: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
  docCount: number;
  status: number;
  userId: string;
}
interface Complaint {
  nameInEnglish: string;
  nameInHindi: string;
  mobileNo: string;
  ward: string;
  problemsCount: number;
  problems: [
    {
      text: {
        english: string;
        hindi: string;
      };
      tag: string | null;
    }
  ];
  tags: string[];
  complaintId: string;
  RequestId: string;
}
interface AuthStore {
  session: SessionStorage;
  setSession: (session: SessionStorage) => void;
  clearSession: () => void;
}

interface Repoter_Report {
  nameInEnglish: string | undefined;
  nameInHindi: string | undefined;
  ReporterId: string | undefined;
  phoneNumber: string | undefined;
  wardNumber: string | undefined;
  problemsReported: [
    {
      category: string[];
      problemDescription_inHindi: string | undefined;
      problemDescription_inEnglish: string | undefined;
    }
  ];
}
interface CommonProblem {
  RequestId: string | undefined;
  ReportId: string | undefined;
  ProblemSort: string | undefined;
  categories: string[];
  count: number;
  reporters: Repoter_Report[];
}
interface WardWiseProblem {
  wardNo: string | undefined;
  Problems: [
    {
      problemSort: string | undefined;
      count: number;
      categories: string[];
      reporters: Repoter_Report[];
    }
  ];
}
interface BarGraphData {
  ward: string;
  totalProblems: number;
  categories: {
    category: string;
    count: number;
  }[];
}
interface DataStore {
  loading: boolean;
  users: UsersData[];
  Requests: RequestData[];
  Complaints: Complaint[];
  oneComplaint?: Complaint | undefined | null;
  commonProblems: CommonProblem[];
  wardWiseProblems: WardWiseProblem[];
  BarGraphData: BarGraphData[];
  setBarGraphData: (data: BarGraphData[]) => void;
  setWardWiseProblems: (wardWiseProblems: WardWiseProblem[]) => void;
  setCommonProblems: (commonProblems: CommonProblem[]) => void;
  setLoading: (loading: boolean) => void;
  setUsers: (users: UsersData[]) => void;
  addUser: (users: UsersData) => void;
  setrequests: (requests: RequestData[]) => void;
  addRequest: (request: RequestData) => void;
  setComplaints: (complaints: Complaint[]) => void;
  setOneComplaint?: (complaint: Complaint | undefined | null) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  loading: false,
  users: [],
  Requests: [],
  Complaints: [],
  commonProblems: [],
  wardWiseProblems: [],
  BarGraphData: [],

  addUser: (users: UsersData) => {
    try {
      set((state) => ({ users: [...state.users, users] }));
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set users");
    }
  },
  setUsers: (users: UsersData[]) => {
    try {
      set({ users });
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set users");
    }
  },
  setrequests: (requests: RequestData[]) => {
    try {
      set({ Requests: requests });
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set requests");
    }
  },
  addRequest: (request: RequestData) => {
    try {
      set((state) => ({ Requests: [...state.Requests, request] }));
      // console.log("Request added successfully:", request);
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to add request");
    }
  },
  setComplaints: (complaints: Complaint[]) => {
    try {
      set({ Complaints: complaints });
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set complaints");
    }
  },
  setOneComplaint: (complaint: Complaint | undefined | null) => {
    try {
      set({ oneComplaint: complaint });
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set one complaint");
    }
  },
  setCommonProblems: (commonProblems: CommonProblem[]) => {
    try {
      set({ commonProblems });
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set common problems");
    }
  },
  setWardWiseProblems: (wardWiseProblems: WardWiseProblem[]) => {
    try {
      set({ wardWiseProblems });
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set ward wise problems");
    }
  },
  setBarGraphData: (data: BarGraphData[]) => {
    try {
      set({ BarGraphData: data });
    } catch (error: any) {
      console.log(error);
      throw new Error("Failed to set bar graph data");
    }
  },
  setLoading: (loading) => set({ loading }),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  session: {
    token: "",
    userId: "",
    name: "",
    email: "",
    roll: 0,
    isAuthenticated: false,
  },
  setSession: (session) => {
    try {
      set({ session });
    } catch (error: any) {
      throw new Error("Failed to set session");
    }
  },
  clearSession: () =>
    set({
      session: {
        token: "",
        userId: "",
        name: "",
        email: "",
        roll: 0,
        isAuthenticated: false,
      },
    }),
}));

export type { UsersData, SessionStorage, RequestData, Complaint };
