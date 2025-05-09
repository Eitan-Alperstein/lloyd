// CONSTANTS //
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = 500;
const height = canvas.height = 500;

let colors = [];
let grid = [];
for (var i = 0; i < height; i++) {
    grid[i] = [];
    for (var j = 0; j < width; j++) {
        grid[i].push(0);
    }
}

// FUNCTIONS //

function createPoints(num) {
    let points = [];

    for (let i = 0; i < num; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height
        });
    }
    for (let i = 0; i < points.length - 1; i++) {
        colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }

    return points;
}

function voronoi(grid, points) {
    for (var y = 0; y < height - 1; y++) {
        for (var x = 0; x < width - 1; x++) {
            let minDist = Infinity;
            let closestPoint = -1;

            for (let pointIndex in points) {
                let point = points[pointIndex];
                let dx = x - point.x;
                let dy = y - point.y;
                let dist = dx ** 2 + dy ** 2;

                if (dist < minDist) {
                    minDist = dist;
                    closestPoint = pointIndex;
                }
            }

            grid[y][x] = closestPoint;
        }
    }
}

function lloyd(grid, points) {
    let pointSums = []; for (let i = 0; i < points.length; i++) { pointSums.push(0); };
    let totalPositions = []; for (let i = 0; i < points.length; i++) { totalPositions.push({ x: 0, y: 0 }); };

    for (var y = 0; y < height - 1; y++) {
        for (var x = 0; x < width - 1; x++) {
            let pointIndex = grid[y][x];
            pointSums[pointIndex]++;
            totalPositions[pointIndex].x += x;
            totalPositions[pointIndex].y += y;
        }
    }

    for (let pointIndex in points) {
        let point = points[pointIndex];
        let totalPosition = totalPositions[pointIndex];
        let pointSum = pointSums[pointIndex];

        if (pointSum > 0) {
            point.x = totalPosition.x / pointSum;
            point.y = totalPosition.y / pointSum;
        }
    }
}

function draw(grid, points) {
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            ctx.fillStyle = colors[grid[y][x]];
            ctx.fillRect(x, y, 1, 1);
        }
    }
    
    ctx.fillStyle = 'black';
    for (let point of points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// RUN-THROUGH //
let points = createPoints(20);

document.querySelector('#step').addEventListener('click', function () {
    ctx.clearRect(0, 0, width, height);

    lloyd(grid, points);

    voronoi(grid, points);

    draw(grid, points);
})

let int;

document.querySelector('#run').addEventListener('click', function () {
    int = setInterval(function () {
        ctx.clearRect(0, 0, width, height);

        lloyd(grid, points);

        voronoi(grid, points);

        draw(grid, points);
    }, 2000);
})

document.querySelector('#stop').addEventListener('click', function () {
    clearInterval(int);
})