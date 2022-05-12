import { handleFlight } from './main';
import { Flight, FlightType } from './types';
import {getFlightPlans, redirect} from './helpers';
import { getLocalStorage } from "./localstorage.js";

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
            } else if(key === "ghcs-org"){
                resolve("test-ghcs-ls");
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

test('gh flight has 3 parameters with gh-org set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: ["test-1", "test-2", "test-3"]
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://github.com/Apollorion/fly/blob/main/help/incorrect-length.md");
});


test('gh flight has 2 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "gh",
        values: ["test", "test"]
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["message"]).toBe("Incorrect Length");
});

test('ghcs flight has 0 parameters with ghcs-org set', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "ghcs",
        values: []
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["message"]).toBe("Incorrect Length");
});

test('ghcs flight has 1 parameters with ghcs-org set and url encoded param', async () => {
    mockRedirect();
    mockGetLocalStorageWithResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "ghcs",
        values: ["test-search:test"]
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://cs.github.com/?scopeName=All+repos&scope=&q=org%3Atest-ghcs-ls+test-search%3Atest");
});

test('ghcs flight has 2 parameters', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "ghcs",
        values: ["test", "test"]
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://cs.github.com/?scopeName=All+repos&scope=&q=org%3Atest+test");
});

test('ghcs flight has 1 parameter, no local storage', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "ghcs",
        values: ["test"]
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://cs.github.com/?scopeName=All+repos&scope=&q=test");
});

test('ghcs flight has 1 parameter, no local storage, url encoded', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "ghcs",
        values: ["test:test"]
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://cs.github.com/?scopeName=All+repos&scope=&q=test%3Atest");
});

test('ghcs flight has 5 parameters, no local storage, url encoded', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "ghcs",
        values: ["test1", "test2", "test3", "test4", "test5"]
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://cs.github.com/?scopeName=All+repos&scope=&q=test1%20test2%20test3%20test4%20test5");
});

test('unknown logical flight', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.LOGICAL,
        identifier: "notreal",
        values: []
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("override");
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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

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
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("override");
});

test('google standard flight', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.STANDARD,
        identifier: "google"
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://google.com/");
});

test('go standard flight', async () => {
    mockRedirect();
    mockGetLocalStorageWithoutResult();

    const flight: Flight = {
        type: FlightType.STANDARD,
        identifier: "go"
    };
    const flightPlans = await getFlightPlans();
    const response = await handleFlight(flight, flightPlans);

    // @ts-ignore
    expect(response["link"]).toBe("https://google.com/");
});