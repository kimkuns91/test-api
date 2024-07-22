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
    const apiToken = process.env.DATA_HUB_API_TOKEN;
    if (!apiToken) {
      return res
        .status(500)
        .json({ message: "API token is missing in environment variables" });
    }

    const response = await axios.post(
      "https://datahub-dev.scraping.co.kr/assist/common/carzen/CarAllInfoInquiry",
      { REGINUMBER, OWNERNAME },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: apiToken,
        },
      }
    );

    const data = response.data;

    if (data.result === "FAIL") {
      return res.status(500).json({ message: data.errMsg, data });
    }

    console.log("data:", data);

    // 응답 데이터 구조화
    const carInfoData = {
      REGINUMBER,
      OWNERNAME,
      CARVENDER: data.data.CARVENDER,
      CARNAME: data.data.CARNAME,
      SUBMODEL: data.data.SUBMODEL,
      UID: data.data.UID,
      CARYEAR: data.data.CARYEAR,
      DRIVE: data.data.DRIVE,
      FUEL: data.data.FUEL,
      PRICE: data.data.PRICE,
      CC: data.data.CC,
      MISSION: data.data.MISSION,
      CARURL: data.data.CARURL,
      VIN: data.data.VIN,
      RESULT: data.data.RESULT,
      ERRMSG: data.data.ERRMSG,
      FRONTTIRE: data.data.FRONTTIRE,
      REARTIRE: data.data.REARTIRE,
      EOILLITER: data.data.EOILLITER,
      WIPER: data.data.WIPER,
      SEATS: data.data.SEATS,
      FUELECO: data.data.FUELECO,
      FUELTANK: data.data.FUELTANK,
      BATTERYLIST: data.data.BATTERYLIST,
    };
    // 외부 API 응답 데이터를 데이터베이스에 저장합니다.
    const newCarInfo = await prisma.car.create({
      data: carInfoData,
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
