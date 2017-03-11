var myGame = function (gameBox) {

    var gameArea, mainArea, infoArea, scoreArea, grids;

    +function () {
        gameArea = document.createElement('div');
        gameArea.id = 'gameArea';

        // 生成格子
        gameArea.innerHTML = function () {
            var line = 486,
                html = '<div class="mainArea">';
            while (line--) html += '<div></div>';
            html += '</div><div class="infoArea">';
            html += '<div class="score">0</div>';
            html += '</div><br class="clear">';
            return html;
        }();

        //获取元素
        gameBox = gameBox || document.body;
        gameBox.appendChild(gameArea);
        mainArea = gameArea.firstChild;
        infoArea = mainArea.nextSibling;
        scoreArea = infoArea.firstChild;

        //
        grids = function (area) {
            var i = 0, x = 0, l = 28, elem, boxs = [];
            var elems = area.getElementsByTagName('div');

            //生成 27 个数组
            while (--l) boxs.push([]);

            //每个数组里再生成 18 个数组
            while (elem = elems[i]) {
                if (x == 18) {
                    l++;
                    x = 0;
                }
                boxs[l].push({
                    elem: elem,
                    status: 0
                });
                i++;
                x++;
            }
            return boxs;
        }(mainArea);
    }();
    var x1, x2, x3, x4, y1, y2, y3, y4, intervalDropMove,               intervalCheckSuccess,
        gameStatus = 1,
        score = 0,
        nextGridsType = 0,
        className = ['', 'show', 'current'],
        switchGridsType = [1, 0, 3, 4, 5, 2, 7, 6, 9, 8, 11, 12, 13, 10, 14, 16, 17, 18, 15],
        gridsType = [
            [[0, 0], [0, 1], [0, 2], [0, 3], -2],
            [[0, 2], [1, 2], [2, 2], [3, 2], 2],
            [[0, 1], [0, 2], [1, 2], [2, 2], 0],
            [[0, 3], [1, 1], [1, 2], [1, 3], 1],
            [[0, 2], [1, 2], [2, 2], [2, 3], 0],
            [[0, 1], [0, 2], [0, 3], [1, 1], 1],
            [[0, 1], [1, 1], [1, 2], [2, 2], 0],
            [[0, 2], [0, 3], [1, 1], [1, 2], 1],
            [[0, 2], [1, 1], [1, 2], [2, 1], 0],
            [[0, 1], [0, 2], [1, 2], [1, 3], 1],
            [[0, 1], [0, 2], [0, 3], [1, 2], 0],
            [[0, 2], [1, 2], [1, 3], [2, 2], 1],
            [[0, 2], [1, 1], [1, 2], [1, 3], 0],
            [[0, 2], [1, 1], [1, 2], [2, 2], 1],
            [[0, 1], [0, 2], [1, 1], [1, 2], 0],
            [[0, 1], [0, 2], [1, 1], [2, 1], 0],
            [[0, 1], [0, 2], [0, 3], [1, 3], 1],
            [[0, 3], [1, 3], [2, 3], [2, 2], 0],
            [[0, 1], [1, 1], [1, 2], [1, 3], 0]
        ],
        gameOver = [
            //  o
            [5, 2], [6, 1], [7, 1], [8, 1], [9, 2], [8, 3], [7, 3], [6, 3],
            //  v
            [5, 5], [6, 5], [7, 5], [8, 5], [9, 6], [8, 7], [7, 7], [6, 7], [5, 7],
            //  e
            [5, 9], [5, 10], [5, 11], [6, 9], [7, 9], [7, 10], [7, 11], [8, 9], [9, 9], [9, 10], [9, 11],
            //  r
            [5, 13], [5, 14], [5, 15], [6, 13], [6, 15], [7, 13], [7, 15], [8, 13], [9, 13], [8, 14], [9, 15]
        ],
        setGridsStatus = function (status) {
            var i = 0, xy = [x1, x2, x3, x4, y1, y2, y3, y4];
            for (; i < 4; i++) {
                grids[xy[i + 4]][xy[i]].elem.className = className[status];
                grids[xy[i + 4]][xy[i]].status = status;
            }
        },
        random = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        createRandomGrids = function (num) {
            var xy, x, pos;
            if (num > -1) {
                xy = getCurrentMinXY();
            } else {
                xy = false;
                num = random(0, 18);
            };
            pos = gridsType[num];
            nextGridsType = switchGridsType[num];
            y1 = pos[0][0];
            y2 = pos[1][0];
            y3 = pos[2][0];
            y4 = pos[3][0];
            x1 = pos[0][1] + 7;
            x2 = pos[1][1] + 7;
            x3 = pos[2][1] + 7;
            x4 = pos[3][1] + 7;
            if (xy) {
                x = xy.x - x1 + pos[4];
                y1 += xy.y;
                y2 += xy.y;
                y3 += xy.y;
                y4 += xy.y;
                x1 += x;
                x2 += x;
                x3 += x;
                x4 += x;
                while (!x1 || !x2 || !x3 || !x4) {
                    x1++;
                    x2++;
                    x3++;
                    x4++;
                };
                while (x1 > 17 || x2 > 17 || x3 > 17 || x4 > 17) {
                    x1--;
                    x2--;
                    x3--;
                    x4--;
                };
            };
        },
        getCurrentMinXY = function () {
            return {
                y: Math.min(y1, y2, y3, y4),
                x: Math.min(x1, x2, x3, x4)
            };
        },
        clearTodefault = function () {//失败时清除全屏
            for (var i = 0, j = 18; i < 27; i++) {
                +function (j) {//函数里 var j ,所以函数外的 j 不变
                    while (--j > -1) {
                        grids[i][j].status = 0;
                        grids[i][j].elem.className = '';
                    }
                }(j);
            };
        },
        showText = function (gridsGroup, className) {
            for (var i = 0, grid; grid = gridsGroup[i]; i++) {
                grids[grid[0]][grid[1]].elem.className = className || 'show';
            }
        },
        dropMove = function () {
            if (
                y1 == 26 || y2 == 26 || y3 == 26 || y4 == 26 ||
                grids[y1 + 1][x1].status == 1 ||
                grids[y2 + 1][x2].status == 1 ||
                grids[y3 + 1][x3].status == 1 ||
                grids[y4 + 1][x4].status == 1
            ) {
                setGridsStatus(2);
                setGridsStatus(1);
                if (!y1 || !y2 || !y3 || !y4) {
                    clearInterval(intervalDropMove);
                    clearInterval(intervalCheckSuccess);
                    clearTodefault();
                    gameStatus = 0;
                    showText(gameOver, 'gameover');
                    return false;
                }
                createRandomGrids();
                return false;
            }
            setGridsStatus(0);
            y1++; y2++; y3++; y4++;
            setGridsStatus(2);
        },
        checkSuccess = function () {
            for (var i = 0, __score = 0; i < 27; i++) {
                +function (iii) {
                    for (var j = 0; j < 18; j++) {
                        if (grids[iii][j].status != 1) return false;
                    }
                    while (iii > 0) {
                        j = 0;
                        for (; j < 18; j++) {
                            grids[iii][j].status = grids[iii - 1][j].status;
                            grids[iii][j].elem.className = grids[iii - 1][j].elem.className;
                        }
                        iii--;
                    }
                    __score++;
                }(i);
            }
            score += __score * __score * 100;
            scoreArea.innerHTML = score;
        };

    createRandomGrids();
    setGridsStatus(2);

    intervalDropMove = setInterval(dropMove, 500);

    intervalCheckSuccess = setInterval(checkSuccess, 500);

    (document.document || document.body).onkeydown = function (e) {
        if (!gameStatus) return;
        switch ((window.event || e).keyCode) {
            case 13:
            case 38:
                getCurrentMinXY();
                setGridsStatus(0);
                createRandomGrids(nextGridsType);
                setGridsStatus(2);
                break;
            case 32:
            case 40:
                dropMove();
                break;
            case 37:
                if (
                    !x1 || !x2 || !x3 || !x4 ||
                    grids[y1][x1 - 1].status == 1 ||
                    grids[y2][x2 - 1].status == 1 ||
                    grids[y3][x3 - 1].status == 1 ||
                    grids[y4][x4 - 1].status == 1
                ) return false;
                setGridsStatus(0);
                x1--; x2--; x3--; x4--;
                setGridsStatus(2);
                break;
            case 39:
                if (
                    x1 == 17 || x2 == 17 || x3 == 17 || x4 == 17 ||
                    grids[y1][x1 + 1].status == 1 ||
                    grids[y2][x2 + 1].status == 1 ||
                    grids[y3][x3 + 1].status == 1 ||
                    grids[y4][x4 + 1].status == 1
                ) return false;
                setGridsStatus(0);
                x1++; x2++; x3++; x4++;
                setGridsStatus(2);
                break;
        }
    };
};

window.onload=function(){
    myGame(document.getElementById('myBox'));
};
