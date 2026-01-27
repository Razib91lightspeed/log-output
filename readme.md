## Exercise 3.11 – Resource Requests and Limits

Resource requests and limits were configured for the project deployment based on observed pod usage.
The values were verified using `kubectl top pods` to ensure they are sensible and sufficient.

**Verification:**
- CPU and memory requests/limits are applied to the running pod
- Actual usage stays well below defined limits

![Exercise 3.11 – Resource requests and limits verification](images/ex3.11.png)



