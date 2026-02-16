// start/lib/database.js
const fs = require('fs');
const path = require('path');

class LowMemoryDatabase {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.cache = new Map();
        this.cacheSize = 100; // Maximum items in cache
        this.writeQueue = [];
        this.writeInterval = 5000; // Batch write every 5 seconds
        this.isWriting = false;
        this.init();
    }

    init() {
        // Ensure database directory exists
        const dir = path.dirname(this.dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Initialize empty DB if doesn't exist
        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, '{}');
        }
        
        // Start batch writer
        setInterval(() => this.flushWrites(), this.writeInterval);
    }

    async read(key) {
        // Check cache first
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        try {
            const data = await this.readFile();
            const value = data[key] || null;
            
            // Add to cache with LRU logic
            this.addToCache(key, value);
            
            return value;
        } catch (error) {
            console.error('Database read error:', error);
            return null;
        }
    }

    async write(key, value) {
        // Queue write operation
        this.writeQueue.push({ key, value, timestamp: Date.now() });
        
        // Update cache
        this.addToCache(key, value);
        
        // If queue is large, flush immediately
        if (this.writeQueue.length >= 50) {
            await this.flushWrites();
        }
    }

    async delete(key) {
        this.writeQueue.push({ key, value: undefined, timestamp: Date.now() });
        this.cache.delete(key);
    }

    addToCache(key, value) {
        // Simple LRU: remove oldest if cache is full
        if (this.cache.size >= this.cacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    async flushWrites() {
        if (this.writeQueue.length === 0 || this.isWriting) return;

        this.isWriting = true;

        try {
            // Group writes by key (keep only the latest write for each key)
            const writes = new Map();
            for (const item of this.writeQueue) {
                writes.set(item.key, item);
            }

            const data = await this.readFile();
            
            // Apply all writes
            for (const [key, item] of writes) {
                if (item.value === undefined) {
                    delete data[key];
                } else {
                    data[key] = item.value;
                }
            }
            
            // Write to file (minified to save space)
            await fs.promises.writeFile(
                this.dbPath,
                JSON.stringify(data)
            );
            
            this.writeQueue = [];
        } catch (error) {
            console.error('Database write error:', error);
        } finally {
            this.isWriting = false;
        }
    }

    async readFile() {
        try {
            const content = await fs.promises.readFile(this.dbPath, 'utf8');
            return JSON.parse(content) || {};
        } catch (error) {
            console.error('Database read error:', error);
            return {};
        }
    }

    async getAllKeys() {
        const data = await this.readFile();
        return Object.keys(data);
    }

    async getAllValues() {
        const data = await this.readFile();
        return Object.values(data);
    }

    async clear() {
        this.cache.clear();
        this.writeQueue = [];
        await fs.promises.writeFile(this.dbPath, '{}');
    }

    async getSize() {
        const data = await this.readFile();
        return Object.keys(data).length;
    }
}

module.exports = LowMemoryDatabase;