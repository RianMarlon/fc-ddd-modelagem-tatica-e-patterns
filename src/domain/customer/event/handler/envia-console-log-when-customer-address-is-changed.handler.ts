import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import { CustomerAddressChanged } from "../customer-address-changed";

export class EnviaConsoleLogWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface<CustomerAddressChanged>
{
  handle(event: CustomerAddressChanged): void {
    console.log(
      `Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address.street}, N° ${event.eventData.address.number} - ${event.eventData.address.zip} - ${event.eventData.address.city}`
    );
  }
}
