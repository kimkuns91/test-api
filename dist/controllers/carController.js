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
        const apiToken = process.env.DATA_HUB_API_TOKEN;
        if (!apiToken) {
            return res
                .status(500)
                .json({ message: "API token is missing in environment variables" });
        }
        const response = yield axios_1.default.post("https://datahub-dev.scraping.co.kr/assist/common/carzen/CarAllInfoInquiry", { REGINUMBER, OWNERNAME }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: apiToken,
            },
        });
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
        const newCarInfo = yield prisma_1.default.car.create({
            data: carInfoData,
        });
        console.log("newCarInfo:", newCarInfo);
        return res.status(200).json(newCarInfo);
    }
    catch (error) {
        console.error("Error fetching car info:", error);
        return res.status(500).json({ message: "조회 중 오류가 발생했습니다. 다시 시도해주세요.", error: error.message });
    }
});
exports.default = {
    getCarInfo,
};
//# sourceMappingURL=carController.js.map