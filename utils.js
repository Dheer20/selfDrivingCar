function lerp(A,B,t){
    return A+(B-A)*t;
}

function calculateOffsets(A, B, C, D) {
    const top = (D.y - C.y) * (A.x - C.x) - (D.x - C.x) * (A.y - C.y);
    const bottom = (D.x - C.x) * (B.y - A.y) - (D.y - C.y) * (B.x - A.x);
    if (bottom != 0.0) {
        const offset = top / bottom;
        if (offset >= 0 && offset <= 1) {
            return offset;
        }
    }else{
    return null;
    }
}

function getIntersection(A, B, C, D) {
    const t = calculateOffsets(A, B, C, D)
    const u = calculateOffsets(C, D, A, B)
    if (t && u) {
        return {
            x: lerp(A.x, B.x, t),
            y: lerp(A.y, B.y, t),
            offset: t
        }
    }else{
    return null
    }
}
