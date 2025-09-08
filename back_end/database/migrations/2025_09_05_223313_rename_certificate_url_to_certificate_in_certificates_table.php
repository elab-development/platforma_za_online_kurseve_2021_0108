<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

public function up()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->renameColumn('certificate_url', 'certificate');
    });
}

public function down()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->renameColumn('certificate', 'certificate_url');
    });
}
};
