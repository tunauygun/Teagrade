function readBubbleSheet(img_input, questions, choices) {
    // Reads the original image
    let mat = cv.imread(img_input);

    // Resize
    let dsize = new cv.Size(700, 700);
    cv.resize(mat, mat, dsize, 0, 0, cv.INTER_AREA);
    let img = mat.clone()

    // Convert to grayscale
    cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY);
    let gray = mat.clone()

    // Gaussian Blur
    let ksize = new cv.Size(7, 7)
    cv.GaussianBlur(mat, mat, ksize, 0, 0, cv.BORDER_DEFAULT);

    // Canny
    cv.Canny(mat, mat, 3, 3);

    // Find Contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(mat, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
    contours = rectContours(contours)

    let contourOrder;
    let firstCentroid = cv.moments(contours[0].get(0), false)["m10"] / cv.moments(contours[0].get(0), false)["m00"]
    let secondCentroid = cv.moments(contours[1].get(0), false)["m10"] / cv.moments(contours[1].get(0), false)["m00"]
    if (firstCentroid < secondCentroid) {
        contourOrder = [0, 1, 2]
    } else {
        contourOrder = [1, 0, 2]
    }

    let leftContour = getCornerPoints(contours[contourOrder[0]])
    let rightContour = getCornerPoints(contours[contourOrder[1]])
    let numberContour = getCornerPoints(contours[contourOrder[2]])

    if (leftContour.size !== 0 && rightContour.size !== 0) {

        let l_warpImg = getWarpPerspectiveImage(leftContour, gray)
        let r_warpImg = getWarpPerspectiveImage(rightContour, gray)
        let num_warpImg = getWarpPerspectiveImage(numberContour, gray)

        let threshCONSTANT = 70
        let l_thresh = new cv.Mat();
        cv.threshold(l_warpImg, l_thresh, threshCONSTANT, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

        let r_thresh = new cv.Mat();
        cv.threshold(r_warpImg, r_thresh, threshCONSTANT, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

        let num_thresh = new cv.Mat();
        cv.threshold(num_warpImg, num_thresh, threshCONSTANT, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
        //cv.adaptiveThreshold(warpImg, thresh, 250, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 2, 2);

        cv.imshow('studentAnswerLeftSection', l_thresh);
        cv.imshow('studentAnswerRightSection', r_thresh);
        cv.imshow('studentNumberSection', num_thresh);

        let l_boxes = splitBoxes(l_thresh, questions / 2, choices)
        let r_boxes = splitBoxes(r_thresh, questions / 2, choices)
        let num_boxes = splitBoxes(num_thresh, 10, 9)

        let l_pixelValues = getBoxValues(l_boxes, questions, choices)
        let r_pixelValues = getBoxValues(r_boxes, questions, choices)
        let num_pixelValues = getNumberBoxValues(num_boxes)

        let l_userAnswers = convertPixelValuesToAnswers(l_pixelValues)
        let r_userAnswers = convertPixelValuesToAnswers(r_pixelValues)
        let studentNumberList = convertPixelValuesToAnswers(num_pixelValues)
        let studentNumber = parseInt(studentNumberList.join(''))

        let userAnswers = l_userAnswers.concat(r_userAnswers)
        userAnswers = convertChoiceIndicesToLetters(userAnswers);

        r_thresh.delete()
        l_thresh.delete()
        num_thresh.delete()
        r_warpImg.delete()
        l_warpImg.delete()
        num_warpImg.delete()
        gray.delete()

        return [userAnswers, studentNumber]
    }

    mat.delete();
    hierarchy.delete()
    img.delete()
}

function getWarpPerspectiveImage(foundContour, gray) {
    //Find the corners
    let corner1 = new cv.Point(foundContour.data32S[0], foundContour.data32S[1]);
    let corner2 = new cv.Point(foundContour.data32S[2], foundContour.data32S[3]);
    let corner3 = new cv.Point(foundContour.data32S[4], foundContour.data32S[5]);
    let corner4 = new cv.Point(foundContour.data32S[6], foundContour.data32S[7]);

    //Order the corners
    let cornerArray = [{ corner: corner1 }, { corner: corner2 }, { corner: corner3 }, { corner: corner4 }];
    //Sort by Y position (to get top-down)
    cornerArray.sort((item1, item2) => { return (item1.corner.y < item2.corner.y) ? -1 : (item1.corner.y > item2.corner.y) ? 1 : 0; }).slice(0, 5);

    //Determine left/right based on x position of top and bottom 2
    let tl = cornerArray[0].corner.x < cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
    let tr = cornerArray[0].corner.x > cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
    let bl = cornerArray[2].corner.x < cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
    let br = cornerArray[2].corner.x > cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];

    //Calculate the max width/height
    let widthBottom = Math.hypot(br.corner.x - bl.corner.x, br.corner.y - bl.corner.y);
    let widthTop = Math.hypot(tr.corner.x - tl.corner.x, tr.corner.y - tl.corner.y);
    let theWidth = (widthBottom > widthTop) ? widthBottom : widthTop;
    let heightRight = Math.hypot(tr.corner.x - br.corner.x, tr.corner.y - br.corner.y);
    let heightLeft = Math.hypot(tl.corner.x - bl.corner.x, tr.corner.y - bl.corner.y);
    let theHeight = (heightRight > heightLeft) ? heightRight : heightLeft;

    //Transform!
    let finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, theWidth - 1, 0, theWidth - 1, theHeight - 1, 0, theHeight - 1]); //
    let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.corner.x, tl.corner.y, tr.corner.x, tr.corner.y, br.corner.x, br.corner.y, bl.corner.x, bl.corner.y]);
    let dsize = new cv.Size(theWidth, theHeight);
    let M = cv.getPerspectiveTransform(srcCoords, finalDestCoords)
    let warpImg = gray.clone()
    cv.warpPerspective(gray, warpImg, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    return warpImg
}

function convertPixelValuesToAnswers(pixelValues) {
    let userAnswers = []
    for (let i = 0; i < pixelValues.length; i++) {
        let questionOptionValues = pixelValues[i]
        const max = Math.max(...questionOptionValues);
        const index = questionOptionValues.indexOf(max);
        userAnswers.push(index)
    }
    return userAnswers
}

function getBoxValues(boxes, questions, choices) {
    let countR = 0
    let countC = 0
    let pixelValues = new Array(questions / 2); // create an empty array of length n
    for (var i = 0; i < questions / 2; i++) {
        pixelValues[i] = new Array(choices); // make each element an array
    }
    for (let b of boxes) {
        let pixelValue = cv.countNonZero(b);
        pixelValues[countR][countC] = pixelValue;
        countC += 1
        if (countC === choices) {
            countC = 0
            countR += 1
        }
    }
    return pixelValues
}

function getNumberBoxValues(boxes) {
    countR = 0
    countC = 0
    let pixelValues = new Array(9); // create an empty array of length n
    for (var i = 0; i < 9; i++) {
        pixelValues[i] = new Array(10); // make each element an array
    }

    for (let i = 0; i < 90; i++) {
        pixelValues[i % 9][parseInt(i / 9)] = cv.countNonZero(boxes[i])
    }
    return pixelValues
}

function splitBoxes(img, row, column) {
    const { width, height } = img.size()
    let boxes = []
    for (let y = 0; y < height; y += height / row) {
        for (let x = 0; x < width; x += width / column) {
            let rect = new cv.Rect(x, y, width / column, height / row);
            try {
                let dst = img.roi(rect);
                boxes.push(dst)
            } catch (err) {
                console.log(err)
            }
        }
    }
    return boxes
}

function rectContours(contours) {
    let cList = []
    let contours_mat_vector_list = []

    for (let i = 0; i < contours.size(); i++) {
        let cnt = contours.get(i);
        let area = cv.contourArea(cnt, false);
        if (area > 50) {
            let perim = cv.arcLength(cnt, true);
            let tmp = new cv.Mat();
            cv.approxPolyDP(cnt, tmp, 0.02 * perim, true);
            //console.log(tmp)
            if (tmp.rows === 4) {
                cList.push(tmp)
            }
        }
    }
    cList.sort(function (a, b) {
        let area_a = cv.contourArea(a, false)
        let area_b = cv.contourArea(b, false)
        if (area_a > area_b) return -1;
        if (area_a < area_b) return 1;
        return 0;
    })

    for (let c of cList) {
        let rectcont = new cv.MatVector();
        rectcont.push_back(c);
        contours_mat_vector_list.push(rectcont)
    }
    return contours_mat_vector_list
}

function getCornerPoints(cnt) {
    cnt = cnt.get(0)
    let perim = cv.arcLength(cnt, true);
    let tmp = new cv.Mat();
    cv.approxPolyDP(cnt, tmp, 0.02 * perim, true);
    return tmp
}

function convertChoiceIndicesToLetters(choiceIndices) {
    let letters = ["A", "B", "C", "D", "E"];
    for (let i = 0; i < choiceIndices.length; i++) {
        choiceIndices[i] = letters[choiceIndices[i]];
    }
    return choiceIndices;
}