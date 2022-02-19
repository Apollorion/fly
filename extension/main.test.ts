import { handleFlight } from './main';
import { Flight, FlightType } from './types';
import { redirect, getLocalStorage } from './helpers';

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

function mockRedirect() {
    // @ts-ignore
    redirect = jest.fn((message, link) => { return {message, link}; });
}

function mockGetLocalStorageWithResult() {
    // @ts-ignore
    getLocalStorage = jest.fn((key) => {
        return new Promise((resolve, reject) => {
            if (key === "gh-org") {
                resolve("test-ls");
            } else if(key === "region") {
                resolve("region-ls");
            } else {
                reject("error");
            }
        });
    });
}

function mockGetLocalStorageWithoutResult() {
    // @ts-ignore
    getLocalStorage = jest.fn((key) => {
        return new Promise((resolve, reject) => {
            reject("error");
        });
    });
}

test('gh flight has 2 parameters with gh-org set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: ["test-1", "test-2", "test-3"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://github.com/test-ls/test-1");
});


test('gh flight has 2 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: ["test", "test"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://github.com/test/test");
});

test('gh flight has 2 parameters with gh-org set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: ["test-1", "test-2"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://github.com/test-1/test-2");
});


test('gh flight has 1 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: ["test"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["message"]).toBe("Incorrect Length");
});

test('gh flight has 1 parameters with gh-org set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: ["test"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://github.com/test-ls/test");
});

test('gh flight has 0 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: []
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["message"]).toBe("Incorrect Length");
});

test('gh flight has 0 parameters with gh-org set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: []
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["message"]).toBe("Incorrect Length");
});

test('unknown logical flight', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "notreal",
        values: []
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["message"]).toBe("Logic Not Found");
});

test('aws flight has 0 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "aws",
        override: "override",
        values: []
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("override");
});

test('aws flight has 1 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "aws",
        override: "override",
        values: ["us-east-1"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://console.aws.amazon.com/console/home?region=us-east-1");
});

test('aws flight has 2 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "aws",
        override: "override",
        values: ["us-east-1", "us-east-2"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://console.aws.amazon.com/console/home?region=us-east-1");
});

test('aws flight has 0 parameters, region is set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "aws",
        override: "override",
        values: []
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://console.aws.amazon.com/console/home?region=region-ls");
});

test('aws flight has 1 parameters, region is set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "aws",
        override: "override",
        values: ["us-east-1"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://console.aws.amazon.com/console/home?region=us-east-1");
});

test('aws flight has 2 parameters, region is set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "aws",
        override: "override",
        values: ["us-east-1", "us-east-2"]
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://console.aws.amazon.com/console/home?region=region-ls");
});

test('datadog standard flight', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.STANDARD,
        identifier: "datadog"
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://app.datadoghq.com/");
});

test('dd standard flight', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.STANDARD,
        identifier: "dd"
    };
    const response = await handleFlight(flight);

    // @ts-ignore
    expect(response["link"]).toBe("https://app.datadoghq.com/");
});