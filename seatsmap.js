$(document).ready(function(){

    SeatsMap.fillSeats();
    for(let i = 0; i <= SeatsMap.seatsAmount; i++){
        console.log(SeatsMap.seats[i].seatNumber + " - " + SeatsMap.seats[i].taken);
    }
    SeatsMap.printSeats();
    SeatsMap.selectSeat();

    let btnConfirm = document.getElementById("btnConfirm");
    btnConfirm.addEventListener("click", (e) => {
        console.log(SeatsMap.selectedSeat);
        SeatsMap.confirmSeat();
    });

    let btnCancel = document.getElementById("btnCancel");
    btnCancel.addEventListener("click", (e) => {
        console.log(SeatsMap.selectedSeat);
        SeatsMap.selectedSeat = null;
        SeatsMap.selectSeat();
    });

    // Tooltip init
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

// Seats map object
const SeatsMap = {
    seatsAmount: 80,
    seats: [],
    seatsPerRow: 9,
    seatsPerCol: 3,
    availableSeatPrice: 59,
    selectedSeat: null,
    totalAmountSpent: 0,
    fillSeats: function()
    {
        // Reset seats
        this.seats = [];
        for(let i = 0; i <= this.seatsAmount; i++){
            this.seats.push({
                seatNumber: i,
                taken: false
            });
        }

        // Random max 60% taken seats
        let takenSeats = Math.floor(Math.random() * ((this.seatsAmount/100) * 60)) + 1;
        let i = 0;
        while(i < takenSeats){
            let takenSeat = Math.floor(Math.random() * ((this.seatsAmount/100) * 60)) + 1;
            if(this.seats[takenSeat].taken == false){
                this.seats[takenSeat].taken = true;
                i++;
            }
        }
    },
    printSeats: function()
    {
        // For each row
        let seatNumber = 0;
        for(let i = 0; i <= Math.ceil(this.seatsAmount / this.seatsPerRow) ; i++){
            let colIndex = 1;
            let seatsPerColPrinted = 0;

            // For each column
            for(let y = 1; y <= this.seatsPerRow ; y++){

                if(seatNumber < this.seats.length){
                    if(SeatsMap.seats[seatNumber].taken)
                    {
                        $('#seatsRow' + colIndex)
                        .append(`<div class='col-4'><img class="seatImg" src="./assets/taken.jpg" alt="X">
                        <div data-seatid="${seatNumber}" class="seatPrice" data-bs-toggle="tooltip" data-bs-placement="top" title="Seat not available"></div></div>`);
                    } else {
                        $('#seatsRow' + colIndex)
                        .append(`<div class='col-4'><img class="seatImg" src="./assets/ava.jpg" alt="A">
                        <div data-seatid="${seatNumber}" class="seatPrice seatAva" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to select this seat!">$${this.availableSeatPrice}</div></div>`);
                    }

                    seatNumber++;
                    seatsPerColPrinted++;

                    if(seatsPerColPrinted >= 3)
                    {
                        seatsPerColPrinted = 0;
                        colIndex++;

                        if(y < this.seatsPerRow){
                            $('#rowNumber' + (colIndex-1)).append(`<div class='col-12 seatRow'>${i+1}</div>`);
                        }
                    }
                }
                
            }
        }

        // Add selection event
        $(".seatAva").on("click", this.selectSeat);
    },
    selectSeat: function() {
        let seatId = $(this).data("seatid");
        SeatsMap.selectedSeat = seatId;

        let selectedPrice = 0;
        if(seatId != null){
            selectedPrice = SeatsMap.availableSeatPrice;
        }

        let selectedSeat = 0;
        if(seatId != null){
            selectedSeat = SeatsMap.selectedSeat;
        }
        
        $("#selectedSeat").empty().append(`<b>#${selectedSeat}</b>`);
        $("#seatFinalPrice").empty().append(`<b>$${selectedPrice}</b>`);
    },
    confirmSeat: function(){
        SeatsMap.seats.find(x => x.seatNumber == SeatsMap.selectedSeat).taken = true;
        SeatsMap.totalAmountSpent += this.availableSeatPrice;
        SeatsMap.selectedSeat = null;
        $(".seatsrow").empty();
        SeatsMap.printSeats();

        // Set total amount spent
        $("#totalAmountSpent").empty().append(`<b>#${SeatsMap.totalAmountSpent}</b>`);
    }
}

