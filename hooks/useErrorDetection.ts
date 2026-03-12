import { useEffect, useState } from 'react';

const useErrorDetection = () => {
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const errorHandler = (error) => {
            setErrors(prevErrors => [...prevErrors, error]);
            // Integrate AI analyzer here
            // Example: AIAnalyzer.analyze(error);
        };

        // Listen for errors in the app
        window.addEventListener('error', errorHandler);
        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, []);

    return errors;
};

export default useErrorDetection;