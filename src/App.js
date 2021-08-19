import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import Rectangle from './components/Rectangle'
import Circles from './components/Circles'
import Texts from './components/Texts'
import Lines from './components/Lines'
import {
    Stage,
    Layer,
    Circle,
    Text,
    Rect,
    Line,
    Label,
    Tag,
} from "react-konva";
import { v4 as uuid } from "uuid";
import { Html } from "react-konva-utils";

let history = [{ shapes: [], lines: [] }];
let historyStep = 0;

export default function App() {
    const [scale, setScale] = useState(1);
    const [stage, setStage] = useState({ x: 0, y: 0 });
    const [shapes, setShapes] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [textEdit, setTextEdit] = useState(false);
    const [editShape, setEditShape] = useState(null);
    const [tool, setTool] = React.useState("");
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const [useTool, setUseTool] = useState(false);
    const [handleDraw, setHandleDraw] = useState(false);

    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.2;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale =
            e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const newX =
            (stage.getPointerPosition().x / newScale - mousePointTo.x) *
            newScale;
        const newY =
            (stage.getPointerPosition().y / newScale - mousePointTo.y) *
            newScale;
        // console.log(oldScale, newScale);
        // console.log(newX, newY)
        // console.log(e.evt.deltaY)
        if (newScale < 1 || newX >= 0 || newY >= 0) {
            setScale(1);
            setStage({ x: 0, y: 0 });
            gridLines(5, 10);
        } else {
            setScale(newScale);
            setStage({ x: newX, y: newY });
            gridLines(5 * parseInt(newScale), 10 * parseInt(newScale));
        }
    };

    const [linesA, setLinesA] = useState([]);
    const [linesB, setLinesB] = useState([]);
    const gridLines = (a, b) => {
        const gridWidth = window.innerWidth / a;
        const gridHeight = window.innerHeight / b;
        setLinesA([]);
        setLinesB([]);

        for (let i = 0; i <= window.innerHeight; i = i + gridHeight) {
            setLinesA((prevData) => [
                ...prevData,
                [0, i, window.innerWidth, i],
            ]);
        }
        for (let i = 0; i <= window.innerWidth; i = i + gridWidth) {
            setLinesB((prevData) => [
                ...prevData,
                [i, 0, i, window.innerHeight],
            ]);
        }
    };

    const handleUndo = () => {
        console.log("undo");
        if (historyStep === 0) {
            return;
        }
        historyStep -= 1;
        const previous = history[historyStep];
        setLines(previous.lines);
        setShapes(previous.shapes);
    };

    const handleRedo = () => {
        console.log("redo");
        if (historyStep === history.length - 1) {
            return;
        }
        historyStep += 1;
        const next = history[historyStep];
        setLines(next.lines);
        setShapes(next.shapes);
    };

    const handleMouseDown = (e) => {
        // console.log(e.target.getStage().getPointerPosition())
        if (useTool) {
            isDrawing.current = true;
            // const transform = e.target.getAbsoluteTransform().copy()
            // transform.invert()
            const stage = e.target.getStage();
            let pos = stage.getPointerPosition();
            // pos = transform.point(pos)
            setLines([
                ...lines,
                {
                    tool,
                    points: [pos.x, pos.y],
                    name: "line",
                    x: 0,
                    y: 0,
                    id: uuid(),
                },
            ]);
            setShapes([
                ...shapes,
                {
                    tool,
                    points: [pos.x, pos.y],
                    name: "line",
                    index: lines.length,
                    x: e.target.x(),
                    y: e.target.y(),
                    id: uuid(),
                },
            ]);

            setHandleDraw(true);
        }
        checkDeselect(e);
    };

    const handleMouseMove = (e) => {
        if (useTool) {
            if (handleDraw) {
                // no drawing - skipping
                if (!isDrawing.current) {
                    return;
                }
                const stage = e.target.getStage();
                const point = stage.getPointerPosition();
                let lastLine = lines[lines.length - 1];
                // add point
                lastLine.points = lastLine.points.concat([point.x, point.y]);

                // replace last
                lines.splice(lines.length - 1, 1, lastLine);
                setLines(lines.concat());

                // let lastLine = ''
                // for(var i=shapes.length-1; i > 0;i--){
                //   if(shapes[i].name=='line'){
                //     lastLine = shapes[shapes.length - 1];
                //   }
                // }

                // // add point
                // lastLine.points = lastLine.points.concat([point.x, point.y]);

                // // replace last
                // shapes.splice(shapes.length - 1, 1, lastLine);
                // setShapes(shapes.concat());
            }
        }
    };

    const handleMouseUp = () => {
        if (useTool) {
            isDrawing.current = false;
            setHandleDraw(false);
            history = history.slice(0, historyStep + 1);
            history = history.concat([{ shapes: shapes, lines: lines }]);
            historyStep += 1;
        }
    };

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
        setTextEdit(false);
    };

    const stageRef = useRef(null);

    const onDelete = (item) => {
        setShapes((oldData) => {
            return oldData.filter((currentData, index) => {
                return currentData.id !== item.id;
            });
        });
        setShapes((prevShape) => [...prevShape, item]);
        history = history.slice(0, historyStep + 1);
        history = history.concat([{ shapes: [...shapes, item], lines: lines }]);
        historyStep += 1;
    };

    const onEdit = (e) => {
        let pos = {};
        setEditShape((shape) => ({ ...shape, text: e.target.value }));
        setShapes(
            shapes.map((elem) => {
                if (elem.id === selectedId) {
                    pos = { ...elem, text: e.target.value };
                    return pos;
                }
                return elem;
            })
        );
        history = history.slice(0, historyStep + 1);
        history = history.concat([{ shapes: [...shapes, pos], lines: lines }]);
        historyStep += 1;
    };

    const handleSave = () => {
        const data = JSON.stringify([shapes, lines]);
        localStorage.setItem("data", data);
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("data"));
        if (data) {
            setLines(data[1]);
            setShapes(data[0]);
            history = [{ shapes: data[0], lines: data[1] }];
            // historyStep += 1;
        }
        gridLines(5, 10);
    }, []);

    return (
        <>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
                onTouchStart={(e) => {
                    checkDeselect(e);
                    handleMouseDown(e);
                }}
                onMouseDown={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onMousemove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onMouseup={handleMouseUp}
                onWheel={handleWheel}
                scaleX={scale}
                scaleY={scale}
                x={stage.x}
                y={stage.y}
            >
                <Layer>
                    {linesA.map((eachLine, i) => {
                        return (
                            <Line
                                key={i}
                                strokeWidth={1}
                                stroke={"gray"}
                                points={eachLine}
                            />
                        );
                    })}
                    {linesB.map((eachLine, i) => {
                        return (
                            <Line
                                key={i}
                                strokeWidth={1}
                                stroke={"gray"}
                                points={eachLine}
                            />
                        );
                    })}

                    {shapes.map((eachShape, i) => {
                        if (eachShape.name === "rectangle") {
                            return (
                                <Rectangle
                                    key={i}
                                    shapeProps={eachShape}
                                    isSelected={eachShape.id === selectedId}
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(eachShape.id);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = shapes.slice();
                                        rects[i] = newAttrs;

                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: rects, lines: lines },
                                        ]);
                                        historyStep += 1;
                                        onDelete(eachShape);
                                        setShapes(rects);
                                    }}
                                    useTool={useTool}
                                    stage={scale}
                                />
                            );
                        } else if (eachShape.name === "circle") {
                            return (
                                <Circles
                                    key={i}
                                    shapeProps={eachShape}
                                    isSelected={eachShape.id === selectedId}
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(eachShape.id);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = shapes.slice();
                                        rects[i] = newAttrs;
                                        setShapes(rects);
                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: rects, lines: lines },
                                        ]);
                                        historyStep += 1;
                                    }}
                                    useTool={useTool}
                                    stage={scale}
                                />
                            );
                        } else if (eachShape.name === "text") {
                            return (
                                <Texts
                                    key={i}
                                    shapeProps={eachShape}
                                    isSelected={eachShape.id === selectedId}
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(eachShape.id);
                                        setEditShape(eachShape);
                                        setTextEdit(!textEdit);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = shapes.slice();
                                        rects[i] = newAttrs;
                                        setShapes(rects);
                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: rects, lines: lines },
                                        ]);
                                        historyStep += 1;
                                    }}
                                    useTool={useTool}
                                    stage={scale}
                                />
                            );
                        } else if (eachShape.name === "line") {
                            return (
                                <Lines
                                    key={i}
                                    points={lines[eachShape.index].points}
                                    tool={lines[eachShape.index].tool}
                                    shapeProps={lines[eachShape.index]}
                                    isSelected={
                                        lines[eachShape.index].id === selectedId
                                    }
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(lines[eachShape.index].id);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = lines.slice();
                                        rects[eachShape.index] = newAttrs;
                                        setLines(rects);
                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: shapes, lines: rects },
                                        ]);
                                        historyStep += 1;
                                    }}
                                    useTool={useTool}
                                />
                            );
                        }
                        else if (eachShape.name === "button") {
                            return (
                                <Label
                                    draggable
                                    x={eachShape.x}
                                    y={eachShape.y}
                                    onClick={() => alert('clicked')}
                                >

                                    <Tag
                                        fill={'#6200ee'}

                                        fontFamily={'Calibri'}
                                        fontSize={18}
                                        padding={5}

                                        lineJoin={'round'}
                                        cornerRadius={5}
                                    />
                                    <Text
                                        height={40}
                                        width={100}
                                        align="center"
                                        verticalAlign="middle"
                                        text={"BUTTON"}
                                        fontFamily={'Calibri'}
                                        fontSize={18}
                                        padding={10}
                                        fill={'white'}
                                    />
                                </Label>
                            )
                        }
                    })}

                    <Circle
                        x={50}
                        y={70}
                        radius={25}
                        stroke="black"
                        id="circle1"
                    />
                    <Circle
                        name="draggableCircle"
                        x={50}
                        y={70}
                        radius={25}
                        stroke="black"
                        draggable={!useTool}
                        id="circle2"
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const circRadius = 25;
                            let newX = e.target.x();
                            let newX1 =
                                Math.floor((newX - circRadius) / gridWidth) *
                                gridWidth;
                            let newX2 =
                                Math.ceil((newX + circRadius) / gridWidth) *
                                gridWidth;
                            // console.log(newX1, newX, newX2)
                            // console.log(newX-newX1+circRadius, newX, newX2-newX-circRadius)
                            if (
                                newX - newX1 - circRadius <=
                                newX2 - newX - circRadius &&
                                newX - newX1 - circRadius <= 10
                            ) {
                                newX = newX1 + circRadius;
                            } else if (newX2 - newX - circRadius <= 10) {
                                newX = newX2 - circRadius;
                            }
                            let newY = e.target.y();
                            let newY1 =
                                Math.floor((newY - circRadius) / gridHeight) *
                                gridHeight;
                            let newY2 =
                                Math.ceil((newY + circRadius) / gridHeight) *
                                gridHeight;
                            // console.log(newY1, newY, newY2)
                            // console.log(newY-newY1+circRadius, newY, newY2-newY-circRadius)
                            if (
                                newY - newY1 - circRadius <=
                                newY2 - newY - circRadius &&
                                newY - newY1 - circRadius <= 10
                            ) {
                                newY = newY1 + circRadius;
                            } else if (newY2 - newY - circRadius <= 10) {
                                newY = newY2 - circRadius;
                            }
                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                radius: 25,
                                stroke: "black",
                                id: uuid(),
                                fill: "red",
                                name: "circle",
                            };

                            setShapes((prevCircles) => [...prevCircles, pos]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableCircle =
                                stage.findOne(".draggableCircle");
                            draggableCircle.position({ x: 50, y: 70 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    />

                    <Rect
                        x={25}
                        y={100}
                        width={50}
                        height={50}
                        stroke="black"
                        id="rect1"
                    />
                    <Rect
                        name="draggableRect"
                        x={25}
                        y={100}
                        width={50}
                        height={50}
                        stroke="black"
                        id="rect1"
                        draggable={!useTool}
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const rectWidth = 50;
                            const rectHeight = 50;

                            let newX = e.target.x();
                            let newX1 =
                                Math.floor(newX / gridWidth) * gridWidth;
                            let newX2 =
                                Math.ceil((newX + rectWidth) / gridWidth) *
                                gridWidth;
                            console.log(newX1, newX, newX2);
                            if (
                                newX - newX1 <= newX2 - newX - rectWidth &&
                                newX - newX1 <= 10
                            ) {
                                newX = newX1;
                            } else if (newX2 - newX - rectWidth <= 10) {
                                newX = newX2 - rectWidth;
                            }

                            let newY = e.target.y();
                            let newY1 =
                                Math.floor(newY / gridHeight) * gridHeight;
                            let newY2 =
                                Math.ceil((newY + rectHeight) / gridHeight) *
                                gridHeight;

                            console.log(newY1, newY, newY2);
                            if (
                                newY - newY1 <= newY2 - newY - rectHeight &&
                                newY - newY1 <= 10
                            ) {
                                newY = newY1;
                            } else if (newY2 - newY - rectHeight <= 10) {
                                newY = newY2 - rectHeight;
                            }

                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                stroke: "black",
                                width: rectWidth,
                                height: rectHeight,
                                id: uuid(),
                                fill: "green",
                                name: "rectangle",
                                rotation: 0,
                            };
                            setShapes((prevRectangles) => [
                                ...prevRectangles,
                                pos,
                            ]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableRectangle =
                                stage.findOne(".draggableRect");
                            draggableRectangle.position({ x: 25, y: 100 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    />
                    <Text
                        fontSize={50}
                        text="T"
                        width={40}
                        height={100}
                        x={35}
                        y={160}
                    />
                    <Text
                        name="draggableText"
                        x={35}
                        y={160}
                        text="T"
                        fontSize={50}
                        width={40}
                        height={100}
                        draggable={!useTool}
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const rectWidth = 40;
                            const rectHeight = 100;

                            let newX = e.target.x();
                            let newX1 =
                                Math.floor(newX / gridWidth) * gridWidth;
                            let newX2 =
                                Math.ceil((newX + rectWidth) / gridWidth) *
                                gridWidth;
                            console.log(newX1, newX, newX2);
                            if (
                                newX - newX1 <= newX2 - newX - rectWidth &&
                                newX - newX1 <= 10
                            ) {
                                newX = newX1;
                            } else if (newX2 - newX - rectWidth <= 10) {
                                newX = newX2 - rectWidth;
                            }

                            let newY = e.target.y();
                            let newY1 =
                                Math.floor(newY / gridHeight) * gridHeight;
                            let newY2 =
                                Math.ceil((newY + rectHeight) / gridHeight) *
                                gridHeight;

                            console.log(newY1, newY, newY2);
                            if (
                                newY - newY1 <= newY2 - newY - rectHeight &&
                                newY - newY1 <= 10
                            ) {
                                newY = newY1;
                            } else if (newY2 - newY - rectHeight <= 10) {
                                newY = newY2 - rectHeight;
                            }

                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                id: uuid(),
                                text: "T",
                                width: 40,
                                textEditVisible: true,
                                height: 100,
                                fontSize: 50,
                                name: "text",
                                rotation: 0,
                            };
                            setShapes((prevTexts) => [...prevTexts, pos]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableText = stage.findOne(".draggableText");
                            draggableText.position({ x: 35, y: 160 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    />
                    <Label
                        x={10}
                        y={210}
                        id="button1"
                        onClick={() => alert('clicked')}
                    >

                        <Tag
                            fill={'#6200ee'}

                            fontFamily={'Calibri'}
                            fontSize={18}
                            padding={5}
                            lineJoin={'round'}
                            cornerRadius={5}
                        />
                        <Text
                            align="center"
                            verticalAlign="middle"
                            text={"BUTTON"}
                            height={40}
                            width={100}
                            fontFamily={'Calibri'}
                            fontSize={18}
                            padding={10}
                            fill={'white'}
                        />
                    </Label>
                    <Label
                        x={10}
                        y={210}
                        name="draggablebutton"
                        id="button1"
                        draggable={!useTool}
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const rectWidth = 100;
                            const rectHeight = 40;

                            let newX = e.target.x();
                            let newX1 =
                                Math.floor(newX / gridWidth) * gridWidth;
                            let newX2 =
                                Math.ceil((newX + rectWidth) / gridWidth) *
                                gridWidth;
                            console.log(newX1, newX, newX2);
                            if (
                                newX - newX1 <= newX2 - newX - rectWidth &&
                                newX - newX1 <= 10
                            ) {
                                newX = newX1;
                            } else if (newX2 - newX - rectWidth <= 10) {
                                newX = newX2 - rectWidth;
                            }

                            let newY = e.target.y();
                            let newY1 =
                                Math.floor(newY / gridHeight) * gridHeight;
                            let newY2 =
                                Math.ceil((newY + rectHeight) / gridHeight) *
                                gridHeight;

                            console.log(newY1, newY, newY2);
                            if (
                                newY - newY1 <= newY2 - newY - rectHeight &&
                                newY - newY1 <= 10
                            ) {
                                newY = newY1;
                            } else if (newY2 - newY - rectHeight <= 10) {
                                newY = newY2 - rectHeight;
                            }

                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                id: uuid(),
                                height: 40,
                                width: 100,
                                name: "button",
                                rotation: 0,
                            };
                            setShapes((prevRectangles) => [
                                ...prevRectangles,
                                pos,
                            ]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableButton =
                                stage.findOne(".draggablebutton");
                            draggableButton.position({ x: 10, y: 210 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    >

                        <Tag
                            fill={'#6200ee'}

                            fontFamily={'Calibri'}
                            fontSize={18}
                            padding={5}

                            lineJoin={'round'}
                            cornerRadius={5}
                        />
                        <Text
                            align="center"
                            verticalAlign="middle"
                            text={"BUTTON"}
                            fontFamily={'Calibri'}
                            fontSize={18}
                            height={40}
                            width={100}
                            padding={10}
                            fill={'white'}
                        />
                    </Label>
                    <Html>
                        <div>
                            <input
                                type="button"
                                value="Undo"
                                onClick={handleUndo}
                            />
                            <input
                                type="button"
                                value="Redo"
                                onClick={handleRedo}
                            />
                            <input
                                type="button"
                                value="Save"
                                onClick={handleSave}
                            />
                            <br />
                            <input
                                type="button"
                                value="Pencil"
                                style={
                                    tool === "pen" && useTool
                                        ? { backgroundColor: "aqua" }
                                        : null
                                }
                                onClick={() => {
                                    setTool("pen");
                                    setUseTool(!useTool);
                                }}
                            />
                            {/* <input type="button" value="Eraser" style={tool=='eraser' && useTool?{backgroundColor: "aqua"}:null} onClick={()=>{setTool('eraser'); setUseTool(!useTool)}} /> */}
                        </div>
                        {textEdit ? (
                            <textarea
                                value={editShape.text}
                                onChange={onEdit}
                            ></textarea>
                        ) : null}
                    </Html>
                </Layer>
            </Stage>
        </>
    );
}