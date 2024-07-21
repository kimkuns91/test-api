"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../prisma"));
const getCarInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { REGINUMBER, OWNERNAME } = req.body;
        console.log("REGINUMBER:", REGINUMBER);
        console.log("OWNERNAME:", OWNERNAME);
        // 먼저 기존 차량 정보를 데이터베이스에서 조회합니다.
        const existingCarInfo = yield prisma_1.default.car.findUnique({
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
        const response = yield axios_1.default.post("https://datahub-dev.scraping.co.kr/assist/common/carzen/CarAllInfoInquiry", {
            REGINUMBER,
            OWNERNAME,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.DATA_HUB_API_TOKEN,
            },
        });
        const data = response.data;
        // 외부 API 응답 데이터를 데이터베이스에 저장합니다.
        const newCarInfo = yield prisma_1.default.car.create({
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
    }
    catch (error) {
        console.error("Error fetching car info:", error);
        return res.status(500).json({ message: "Error fetching car info", error });
    }
});
exports.default = {
    getCarInfo,
};
//# sourceMappingURL=carController.js.map