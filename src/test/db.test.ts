// src/test/config/connectDB.test.ts
import mongoose from 'mongoose';
import connectDB from '../config/db';

jest.mock('mongoose'); // Automatically mock mongoose.connect

describe('Database Connection', () => {
  const mockConnect = mongoose.connect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should connect to MongoDB and log success message', async () => {
    // Arrange
    const mockConn = {
      connection: {
        host: 'localhost'
      }
    };
    mockConnect.mockResolvedValue(mockConn); // mock resolved value

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Act
    await connectDB();

    // Assert
    expect(mockConnect).toHaveBeenCalledWith(process.env.MONGO_URI, { dbName: 'employeePortal' });
    expect(consoleLogSpy).toHaveBeenCalledWith(`MongoDB Connected: ${mockConn.connection.host}`);
  });

  it('should log error and exit process on connection failure', async () => {
    // Arrange
    const fakeError = new Error('Connection failed');
    mockConnect.mockRejectedValue(fakeError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);

    // Act
    await connectDB();

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith('MongoDB connection failed:', fakeError);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
