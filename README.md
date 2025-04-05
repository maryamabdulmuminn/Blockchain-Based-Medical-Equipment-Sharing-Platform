# Blockchain-Based Specialized Medical Equipment Sharing

This project implements a decentralized system for sharing expensive medical equipment among healthcare facilities using blockchain technology. The system enables secure and transparent tracking of medical equipment, verification of facilities, scheduling of equipment use, and monitoring of equipment utilization.

## Smart Contracts

The system consists of four core Clarity smart contracts:

### 1. Device Registration Contract

This contract handles the registration and management of medical equipment:

- Register new medical devices with detailed information
- Update device status (active, inactive, maintenance)
- Record maintenance activities
- Query device information

### 2. Facility Verification Contract

This contract validates legitimate healthcare providers:

- Register healthcare facilities
- Verify facilities by admins
- Suspend facilities when necessary
- Check facility verification status

### 3. Scheduling Contract

This contract manages equipment sharing schedules:

- Request bookings for specific time periods
- Confirm bookings by device owners
- Complete bookings after usage
- Cancel bookings when necessary
- Query booking information

### 4. Usage Tracking Contract

This contract monitors equipment utilization and maintenance needs:

- Track start and end of equipment usage
- Report issues with equipment
- Set and monitor maintenance schedules
- Check if maintenance is due

## System Workflow

1. Healthcare facilities register and get verified
2. Medical equipment owners register their devices
3. Verified facilities can request to book equipment
4. Equipment owners confirm booking requests
5. Facilities track usage when using the equipment
6. Issues can be reported and maintenance scheduled
7. Usage data helps optimize equipment sharing

## Benefits

- **Cost Reduction**: Facilities share expensive equipment instead of each purchasing their own
- **Efficiency**: Increased utilization of medical equipment
- **Transparency**: Clear records of equipment usage and ownership
- **Quality**: Better maintenance tracking ensures equipment reliability
- **Access**: Smaller facilities gain access to advanced equipment

## Getting Started

1. Deploy the four contracts to the Stacks blockchain
2. Set up administrative accounts for facility verification
3. Register your facility and/or medical equipment
4. Begin participating in the equipment sharing network

## Contract Interaction

Contracts interact with each other through contract calls:
- Scheduling contract verifies facility status with the Facility Verification contract
- Usage Tracking contract checks booking information with the Scheduling contract
- All contracts verify device information with the Device Registration contract

## Security Considerations

- Only device owners can confirm bookings and update device status
- Only verified facilities can request bookings
- Only administrators can verify facilities
- Equipment usage is tracked with clear accountability
