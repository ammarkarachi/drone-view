

// get first time in app from local storage
export const getFirstTimeInApp = () : boolean => {
    const firsTime = localStorage.getItem('notFirstVisitInDroneViewMX');
    localStorage.setItem('notFirstVisitInDroneViewMX', 'true');

    return firsTime === 'true';

}
