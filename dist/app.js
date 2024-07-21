"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routes_1 = __importDefault(require("./routes")); // 라우터 임포트
const app = (0, express_1.default)();
// 미들웨어 설정
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.get("/", (_req, res) => {
    return res.send("Express Typescript on Vercel");
});
// 라우터 설정
app.use("/api", routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map