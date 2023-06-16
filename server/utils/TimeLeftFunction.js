

function calculateTimeLeft(orders){

    // Get user timezone offset
    const userOffset = new Date().getTimezoneOffset() * 60 * 1000;

    // Calculate time left for each order
    const ordersWithTimeLeft = orders.map(order => {
        const deliveryDate = new Date(order.createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + parseInt(order.days));
      
        // Adjust delivery date for user timezone
        const deliveryDateOffset = deliveryDate.getTimezoneOffset() * 60 * 1000;
        const deliveryDateWithOffset = new Date(deliveryDate.getTime() - deliveryDateOffset + userOffset);
      
        const currentTime = new Date();
      
        // Adjust current time for user timezone
        const currentOffset = currentTime.getTimezoneOffset() * 60 * 1000;
        const currentTimeWithOffset = new Date(currentTime.getTime() - currentOffset + userOffset);
      
        const timeleft = deliveryDateWithOffset - currentTimeWithOffset;
      
        const hoursLeft = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeleft % (1000 * 60)) / 1000);
        const daysLeft = Math.floor(timeleft / (1000 * 60 * 60 * 24));

        return { ...order, timeleft: { days: daysLeft, hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft } };
    });

    return ordersWithTimeLeft;

}

module.exports = calculateTimeLeft