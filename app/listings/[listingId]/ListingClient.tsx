import { Reservation } from "@prisma/client";
import { SafeListing } from "@/app/types";

interface ListingClientProps {
    reservations?: Reservation[];
    listing: SafeListing
}

const ListingClient = () => {
    return (
        <div>
            
        </div>
    );
}

export default ListingClient;
