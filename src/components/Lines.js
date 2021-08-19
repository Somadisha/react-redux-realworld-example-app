import React from 'react'
import { Line, Transformer } from "react-konva";

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

export default Lines