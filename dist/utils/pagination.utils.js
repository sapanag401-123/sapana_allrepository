"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = ({ totalCount, perPage, currentPage, }) => {
    const totalPage = Math.ceil(totalCount / perPage);
    const nextPage = currentPage < totalPage ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    return {
        totalCount,
        perPage,
        currentPage,
        totalPage,
        nextPage,
        prevPage,
    };
};
exports.getPagination = getPagination;
