// frontend/src/hooks/useGetAllJobs.jsx
import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((s) => s.job);

  useEffect(() => {
    let cancelled = false;

    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/public`,
          { params: { keyword: searchedQuery || "" } }
        );
        if (!cancelled && res.data?.success) {
          dispatch(setAllJobs(Array.isArray(res.data.jobs) ? res.data.jobs : []));
        }
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        if (!cancelled) dispatch(setAllJobs([]));
      }
    };

    fetchAllJobs();
    return () => { cancelled = true; };
  }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;
