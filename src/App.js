import "./App.css";

import React, { useState, useRef, useEffect } from "react";
import {
    Stage,
    Layer,
    Circle,
    Text,
    Ellipse,
    Rect,
    Transformer,
    Line,
} from "react-konva";
import { v4 as uuid } from "uuid";
import { Html } from "react-konva-utils";

const Rectangle = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    useTool,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);
    return (
        <React.Fragment>
            <Rect
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable={!useTool && isSelected}
                // onDragStart={onMove}
                // onTouchStart={onMove}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const matrix = node.getAbsoluteTransform().getMatrix();
                    console.log(node.rotation());
                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const Circles = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    useTool,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Circle
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable={!useTool && isSelected}
                // onDragStart={onMove}
                // onTouchStart={onMove}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        radius: Math.max(
                            node.radius() * scaleX,
                            node.radius() * scaleY
                        ),
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.radius < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const Texts = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    useTool,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Text
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable={!useTool && isSelected}
                // onDragStart={onMove}
                // onTouchStart={onMove}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value

                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const Lines = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    points,
    tool,
    useTool,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Line
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                points={points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                draggable={!useTool && isSelected}
                globalCompositeOperation={
                    tool === "eraser" ? "destination-out" : "source-over"
                }
                // onDragStart={onMove}
                // onTouchStart={onMove}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    let newPoints = [];

                    for (let i = 0; i < shapeProps.points.length; i = i + 2) {
                        newPoints = newPoints.concat([
                            shapeProps.points[i] * scaleX,
                            shapeProps.points[i + 1] * scaleY,
                        ]);
                    }
                    onChange({
                        ...shapeProps,
                        // x: node.x(),
                        // y: node.y(),
                        // set minimal value
                        points: newPoints,
                        rotation: node.rotation(),
                        // width: Math.max(5, node.width() * scaleX),
                        // height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

let history = [{ shapes: [], lines: [] }];
let historyStep = 0;

export default function App() {
    const [circles, setCircles] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [textEdit, setTextEdit] = useState(false);
    const [editShape, setEditShape] = useState(null);
    const [tool, setTool] = React.useState("");
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const [useTool, setUseTool] = useState(false);
    const [handleDraw, setHandleDraw] = useState(false);

    const gridWidth = window.innerWidth / 10;
    const gridHeight = window.innerHeight / 5;

    const linesA = [];
    const linesB = [];

    for (let i = 0; i < window.innerHeight; i = i + gridHeight) {
        linesA.push(
            <Line
                strokeWidth={0.5}
                stroke={"gray"}
                points={[0, i, window.innerWidth, i]}
            />
        );
    }
    for (let i = 0; i < window.innerWidth; i = i + gridWidth) {
        linesB.push(
            <Line
                strokeWidth={0.5}
                stroke={"gray"}
                points={[i, 0, i, window.innerHeight]}
            />
        );
    }

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
                if (elem.id == selectedId) {
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
            >
                <Layer>
                    {linesA}
                    {linesB}

                    {shapes.map((eachShape, i) => {
                        if (eachShape.name == "rectangle") {
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
                                />
                            );
                        } else if (eachShape.name == "circle") {
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
                                />
                            );
                        } else if (eachShape.name == "text") {
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
                                />
                            );
                        } else if (eachShape.name == "line") {
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
                    })}
                    {/* <Line
             x={200}
             y={300}
              points={[100, 100, 200, 200]}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                'source-over'
              }
            /> */}
                    {/* {lines.map((line, i) => (
            <Lines
              key={i}
              points={line.points}
              tool={line.tool}
              shapeProps={line}
              isSelected={line.id === selectedId}
              onSelect={() => {
                setUseTool(false)
                onDelete(line);
                selectShape(line.id);
                
              }}
              onMove={()=>onDelete(line)}
              onChange={(newAttrs) => {
                const rects = lines.slice();
                rects[i] = newAttrs;
                setLines(rects);
              }}
            
            />
          ))} */}

                    <Circle
                        name="draggableCircle1"
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
                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: e.target.x(),
                                y: e.target.y(),
                                radius: 25,
                                stroke: "black",
                                id: uuid(),
                                fill: "red",
                                name: "circle",
                            };

                            setShapes((prevCircles) => [...prevCircles, pos]);
                            console.log(shapes);
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
                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: e.target.x(),
                                y: e.target.y(),
                                stroke: "black",
                                width: 50,
                                height: 50,
                                id: uuid(),
                                fill: "green",
                                name: "rectangle",
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
                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: e.target.x(),
                                y: e.target.y(),
                                id: uuid(),
                                text: "T",
                                width: 40,
                                textEditVisible: true,
                                height: 100,
                                fontSize: 50,
                                name: "text",
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
                                    tool == "pen" && useTool
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
