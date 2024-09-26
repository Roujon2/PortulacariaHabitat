import React, { useEffect } from "react";

import './successConfirmationBox.css';


interface SuccessConfirmationBoxProps {
    message: string;
    duration: number;
    onClose: () => void;
}

const SuccessConfirmationBox: React.FC<SuccessConfirmationBoxProps> = ({ message, duration, onClose }: SuccessConfirmationBoxProps) => {
    const [visible, setVisible] = React.useState<boolean>(false);

    useEffect(() => {
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, duration);

        return () => {clearTimeout(timer)};
    }, [duration, onClose]);


    return (
        <div className={`success-message ${visible ? "visible" : ""}`}>
            {message}
        </div>
    );
}

export default SuccessConfirmationBox;