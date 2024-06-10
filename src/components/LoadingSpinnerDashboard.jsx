const LoadingSpinnerDashboard = () => {
    return (
        <section className="py-3 py-md-5 min-vh-50 d-flex justify-content-center align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            <h3 className="h2 mb-2">{"Please wait, loading chart."}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoadingSpinnerDashboard