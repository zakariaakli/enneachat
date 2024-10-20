import { createContext, useState } from "react";
import { ResultData} from "../Models/EnneagramResult";




export const DataContext = createContext<ResultData>(
  { enneagramType1: 0, enneagramType2: 0,
    enneagramType3: 0, Profession: "",
    UserName: "", Triad: "", UserId: "" });


