import { Request, Response } from "express";

import axios from "axios";
import prisma from "../prisma";

const getCarInfo = async (req: Request, res: Response) => {
  try {
    const { REGINUMBER, OWNERNAME } = req.body;

    console.log("REGINUMBER:", REGINUMBER);
    console.log("OWNERNAME:", OWNERNAME);

    // 먼저 기존 차량 정보를 데이터베이스에서 조회합니다.
    const existingCarInfo = await prisma.car.findUnique({
      where: {
        REGINUMBER,
        OWNERNAME,
      },
    });

    // 기존 차량 정보가 존재하면 이를 반환합니다.
    if (existingCarInfo) {
      return res.status(200).json(existingCarInfo);
    }

    // 기존 차량 정보가 없을 경우 외부 API를 호출합니다.
    if (!process.env.DATA_HUB_API_TOKEN) {
      return res.status(500).json({ message: "API token is missing in environment variables" });
    }

    const response = await axios.post(
      "https://datahub-dev.scraping.co.kr/assist/common/carzen/CarAllInfoInquiry",
      {
        REGINUMBER,
        OWNERNAME,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DATA_HUB_API_TOKEN,
        },
      }
    );

    const data = response.data;

    // 외부 API 응답 데이터를 데이터베이스에 저장합니다.
    const newCarInfo = await prisma.car.create({
      data: {
        REGINUMBER: data.REGINUMBER,
        OWNERNAME: data.OWNERNAME,
        CARVENDER: data.CARVENDER,
        CARNAME: data.CARNAME,
        SUBMODEL: data.SUBMODEL,
        UID: data.UID,
        CARYEAR: data.CARYEAR,
        DRIVE: data.DRIVE,
        FUEL: data.FUEL,
        PRICE: data.PRICE,
        CC: data.CC,
        MISSION: data.MISSION,
        CARURL: data.CARURL,
        VIN: data.VIN,
        RESULT: data.RESULT,
        ERRMSG: data.ERRMSG,
        FRONTTIRE: data.FRONTTIRE,
        REARTIRE: data.REARTIRE,
        EOILLITER: data.EOILLITER,
        WIPER: data.WIPER,
        SEATS: data.SEATS,
        FUELECO: data.FUELECO,
        FUELTANK: data.FUELTANK,
        BATTERYLIST: data.BATTERYLIST,
      },
    });

    console.log("newCarInfo:", newCarInfo);

    return res.status(200).json(newCarInfo);
  } catch (error) {
    console.error("Error fetching car info:", error);
    return res.status(500).json({ message: "Error fetching car info", error });
  }
};

export default {
  getCarInfo,
};
