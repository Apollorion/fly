import { repoManagement } from './helpers';
import {setLocalStorage, getLocalStorage} from "./localstorage.js";

function mockGetLocalStorageWithResult(type: string) {
    // @ts-ignore
    getLocalStorage = jest.fn(async (key) => {
        return new Promise((resolve, reject) => {
            if(type === "good"){
                resolve("{}");
            } else {
                resolve("{\"apollorion\": \"https://apollorion.com/flight_repo.json\"}");
            }
        });
    });
}

function mockGetLocalStorageWithoutResult() {
    // @ts-ignore
    getLocalStorage = jest.fn(async (key) => {
        return new Promise((resolve, reject) => {
            reject();
        });
    });
}

function mockSetLocalStorage() {
    // @ts-ignore
    setLocalStorage = jest.fn();
}

test("repo can set", async () => {
    mockGetLocalStorageWithResult("good");
    mockSetLocalStorage();

    const result = await repoManagement(["repo", "set", "apollorion", "https://apollorion.com/flight_repo.json"]);
    expect(result).toBe("set apollorion https://apollorion.com/flight_repo.json");
});

test("repo can unset", async () => {
    mockGetLocalStorageWithResult("good");
    mockSetLocalStorage();

    const result = await repoManagement(["repo", "unset", "apollorion"]);
    expect(result).toBe("unset apollorion");
});

test("repo can update", async () => {
    mockGetLocalStorageWithResult("good");
    mockSetLocalStorage();

    const result = await repoManagement(["repo", "update"]);
    expect(result).toBe("repos updated");
});

test("repo cannot update", async () => {
    mockGetLocalStorageWithResult("bad");
    mockSetLocalStorage();
    console.log = jest.fn();

    const result = await repoManagement(["repo", "update"]);
    expect(result).toBe("repos updated");
    expect(console.log).toHaveBeenCalledWith('Failed to fetch repo apollorion');
});

test("repo set no local storage", async () => {
    mockGetLocalStorageWithoutResult();
    mockSetLocalStorage();

    const result = await repoManagement(["repo", "set", "apollorion", "https://apollorion.com/flight_repo.json"]);
    expect(result).toBe("set apollorion https://apollorion.com/flight_repo.json");
});

test("repo unset no local storage", async () => {
    mockGetLocalStorageWithoutResult();
    mockSetLocalStorage();

    const result = await repoManagement(["repo", "unset", "apollorion"]);
    expect(result).toBe("unset apollorion");
});

test("repo update no local storage", async () => {
    mockGetLocalStorageWithoutResult();
    mockSetLocalStorage();

    const result = await repoManagement(["repo", "update"]);
    expect(result).toBe("repos updated");
});

test("repo management bad query", async () => {
    const result = await repoManagement(["repo", "broken-query"]);
    expect(result).toBe("Attempted to run broken-query, but that is not a valid action.");
});

test("repo management set called incorrectly", async () => {
    const result = await repoManagement(["repo", "set", "apollorion"]);
    expect(result).toBe("set called with missing parameter");
});

test("repo management unset called incorrectly", async () => {
    const result = await repoManagement(["repo", "unset"]);
    expect(result).toBe("unset called with missing parameter");
});