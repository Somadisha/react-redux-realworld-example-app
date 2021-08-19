import React from 'react'
import {
    Circle,
    Transformer
} from 'react-konva'

const Circles = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    useTool,
    stage,
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
                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const circRadius = shapeProps.radius;
                    let newX = e.target.x();
                    let newX1 =
                        Math.floor((newX - circRadius) / gridWidth) * gridWidth;
                    let newX2 =
                        Math.ceil((newX + circRadius) / gridWidth) * gridWidth;
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
                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,
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

                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const circRadius = Math.max(
                        node.radius() * scaleX,
                        node.radius() * scaleY
                    );
                    let newX = e.target.x();
                    let newX1 =
                        Math.floor((newX - circRadius) / gridWidth) * gridWidth;
                    let newX2 =
                        Math.ceil((newX + circRadius) / gridWidth) * gridWidth;

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

                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,
                        // set minimal value
                        radius: circRadius,
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
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

export default Circles