import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity VM functions for testing
const mockClarity = {
  tx: {
    sender: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    sponsorAddress: null
  },
  blockHeight: 100,
  contracts: {},
  dataVar: {},
  dataMap: {
    devices: {}
  }
};

// Mock contract functions
const deviceRegistration = {
  lastDeviceId: 0,
  
  registerDevice: (name, model, manufacturer, acquisitionDate) => {
    const newId = ++deviceRegistration.lastDeviceId;
    mockClarity.dataMap.devices[newId] = {
      name,
      model,
      manufacturer,
      owner: mockClarity.tx.sender,
      acquisitionDate,
      status: 1,
      lastMaintenance: 0
    };
    return { value: newId };
  },
  
  updateDeviceStatus: (deviceId, newStatus) => {
    const device = mockClarity.dataMap.devices[deviceId];
    if (!device) return { error: 1 };
    if (device.owner !== mockClarity.tx.sender) return { error: 2 };
    if (![0, 1, 2].includes(newStatus)) return { error: 3 };
    
    device.status = newStatus;
    return { value: true };
  },
  
  recordMaintenance: (deviceId) => {
    const device = mockClarity.dataMap.devices[deviceId];
    if (!device) return { error: 1 };
    if (device.owner !== mockClarity.tx.sender) return { error: 2 };
    
    device.status = 1; // Active
    device.lastMaintenance = mockClarity.blockHeight;
    return { value: true };
  },
  
  getDevice: (deviceId) => {
    return mockClarity.dataMap.devices[deviceId] || null;
  }
};

describe('Device Registration Contract', () => {
  beforeEach(() => {
    // Reset the mock data before each test
    deviceRegistration.lastDeviceId = 0;
    mockClarity.dataMap.devices = {};
    mockClarity.blockHeight = 100;
  });
  
  it('should register a new device successfully', () => {
    const result = deviceRegistration.registerDevice(
        'MRI Scanner',
        'Discovery MR750',
        'GE Healthcare',
        1640995200 // Jan 1, 2022
    );
    
    expect(result.value).toBe(1);
    
    const device = deviceRegistration.getDevice(1);
    expect(device).not.toBeNull();
    expect(device.name).toBe('MRI Scanner');
    expect(device.model).toBe('Discovery MR750');
    expect(device.manufacturer).toBe('GE Healthcare');
    expect(device.status).toBe(1); // Active
  });
  
  it('should update device status', () => {
    // First register a device
    deviceRegistration.registerDevice('CT Scanner', 'Revolution CT', 'GE Healthcare', 1640995200);
    
    // Update status to maintenance
    const result = deviceRegistration.updateDeviceStatus(1, 2);
    expect(result.value).toBe(true);
    
    const device = deviceRegistration.getDevice(1);
    expect(device.status).toBe(2); // Maintenance
  });
  
  it('should fail to update status for non-existent device', () => {
    const result = deviceRegistration.updateDeviceStatus(999, 2);
    expect(result.error).toBe(1);
  });
  
  it('should record maintenance and update device status', () => {
    // First register a device
    deviceRegistration.registerDevice('X-Ray Machine', 'DRX-Revolution', 'Carestream', 1640995200);
    
    // Put it in maintenance status
    deviceRegistration.updateDeviceStatus(1, 2);
    
    // Record maintenance
    const result = deviceRegistration.recordMaintenance(1);
    expect(result.value).toBe(true);
    
    const device = deviceRegistration.getDevice(1);
    expect(device.status).toBe(1); // Active after maintenance
    expect(device.lastMaintenance).toBe(100); // Current block height
  });
  
  it('should not allow unauthorized users to update device status', () => {
    // Register a device
    deviceRegistration.registerDevice('MRI Scanner', 'Discovery MR750', 'GE Healthcare', 1640995200);
    
    // Change the sender
    const originalSender = mockClarity.tx.sender;
    mockClarity.tx.sender = 'ST2REHHS5J3CERCRBEPMGH7OQPZFJ2ZN5ZKV09JQT';
    
    // Try to update status
    const result = deviceRegistration.updateDeviceStatus(1, 2);
    expect(result.error).toBe(2);
    
    // Restore original sender
    mockClarity.tx.sender = originalSender;
  });
});
